#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fichiers prêts pour l'imprimeur (impression à la demande), format 6x9 pouces :
  - Interieur-...-6x9.pdf : bloc-livre, fond blanc, marges de reliure, polices incorporées
  - Couverture-...-6x9.pdf : 4e + dos + 1re d'un seul tenant, fond perdu, dos calculé
"""
import pathlib, fitz
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas as canvaslib
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (Frame, PageTemplate, Paragraph, Spacer, PageBreak, NextPageTemplate)
import build_pdf as B

BASE = pathlib.Path(__file__).parent
LIB = "/usr/share/fonts/truetype/liberation/"

# --- polices incorporées (obligatoire pour l'impression) ---
pdfmetrics.registerFont(TTFont("Serif", LIB+"LiberationSerif-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Serif-Bold", LIB+"LiberationSerif-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Serif-Italic", LIB+"LiberationSerif-Italic.ttf"))
pdfmetrics.registerFont(TTFont("Serif-BoldItalic", LIB+"LiberationSerif-BoldItalic.ttf"))
pdfmetrics.registerFontFamily("Serif", normal="Serif", bold="Serif-Bold",
                              italic="Serif-Italic", boldItalic="Serif-BoldItalic")
FONTMAP = {"Times-Roman": "Serif", "Times-Bold": "Serif-Bold",
           "Times-Italic": "Serif-Italic", "Times-BoldItalic": "Serif-BoldItalic"}

NAVY, GOLD, CREAM = B.NAVY, B.GOLD, B.CREAM
PT = 72.0
TRIM_W, TRIM_H = 6*inch, 9*inch
BLEED = 0.125*inch
PAGE_THICK = 0.002252*inch     # papier blanc (norme KDP)

def serif_styles(scale):
    st = B.make_styles(scale)
    for s in st.values():
        s.fontName = FONTMAP.get(s.fontName, s.fontName)
    return st

# ====================== INTÉRIEUR ======================
def build_interior(outfile, scale=1.13):
    PW, PH = TRIM_W, TRIM_H
    inside, outside, tb = 0.8*inch, 0.55*inch, 0.7*inch   # marges (reliure = inside)
    st = serif_styles(scale)
    headings = B.extract_headings()
    avail = PW - inside - outside

    def title_page():
        return [Spacer(1, PH*0.16),
            Paragraph("Lucette Laudumiey", ParagraphStyle("a", fontName="Serif-Italic",
                fontSize=14*scale, alignment=TA_CENTER, textColor="#444444")),
            Spacer(1, PH*0.12),
            Paragraph("PLUS HAUT<br/>QUE LES MURS", ParagraphStyle("t", fontName="Serif-Bold",
                fontSize=30*scale, alignment=TA_CENTER, leading=36*scale)),
            Spacer(1, PH*0.05),
            Paragraph("Un roman en deux tomes sur la jeunesse,<br/>le respect, "
                "l'éducation et le handicap", ParagraphStyle("s", fontName="Serif-Italic",
                fontSize=13*scale, alignment=TA_CENTER, leading=18*scale)),
            Spacer(1, PH*0.10),
            Paragraph("— Au cœur du Béarn, à Orthez —", ParagraphStyle("p", fontName="Serif",
                fontSize=11*scale, alignment=TA_CENTER, textColor="#666666"))]

    def footer(cv, doc):
        if doc.page > 1:
            cv.saveState(); cv.setFont("Serif", 9); cv.setFillColor(HexColor("#555555"))
            cv.drawCentredString(PW/2, 0.5*inch, str(doc.page)); cv.restoreState()

    def make_doc():
        # marges en miroir : reliure à l'intérieur (gauche sur page impaire)
        fr = Frame(inside, tb, avail, PH-2*tb, id="r")   # recto (impair)
        fl = Frame(outside, tb, avail, PH-2*tb, id="l")  # verso (pair)
        d = B.BookDoc(str(BASE/outfile), pagesize=(PW, PH),
                      pageTemplates=[PageTemplate(id="r", frames=[fr], onPage=footer),
                                     PageTemplate(id="l", frames=[fl], onPage=footer)],
                      title="Plus haut que les murs", author="Lucette Laudumiey")
        d.headings = headings
        # alternance recto/verso automatique
        def begin():
            B.BaseDocTemplate.handle_pageBegin(d)
            d.handle_nextPageTemplate("l" if d.page % 2 == 1 else "r")
        d.handle_pageBegin = begin
        return d

    def story(pages):
        return (title_page() + [PageBreak(),
                Paragraph("Table des matières", st["toch"])] +
                [B.toc_block(headings, pages, st, avail, scale)[1]] +
                B.content_story(st, PH))

    d1 = make_doc(); d1.build(story({})); pages = dict(d1.pages)
    d2 = make_doc(); d2.build(story(pages))
    n = fitz.open(str(BASE/outfile)).page_count
    print("Intérieur :", outfile, "->", n, "pages")
    return n

# ====================== COUVERTURE ======================
def build_cover(outfile, n_pages):
    spine = n_pages * PAGE_THICK
    CW = 2*BLEED + 2*TRIM_W + spine
    CH = 2*BLEED + TRIM_H
    c = canvaslib.Canvas(str(BASE/outfile), pagesize=(CW, CH))

    # fond perdu : navy sur toute la surface (bords compris)
    c.setFillColor(NAVY); c.rect(0, 0, CW, CH, fill=1, stroke=0)

    back_x0 = BLEED
    spine_x0 = BLEED + TRIM_W
    front_x0 = BLEED + TRIM_W + spine
    yb = BLEED  # bas de la zone rognée

    def stars(cx0, w, band):
        c.setFillColor(CREAM)
        pts = [(0.18,0.93),(0.34,0.90),(0.5,0.94),(0.66,0.90),(0.82,0.93),
               (0.26,0.10),(0.5,0.07),(0.74,0.10)] if band else \
              [(0.18,0.90),(0.34,0.93),(0.5,0.89),(0.66,0.93),(0.82,0.90),
               (0.24,0.30),(0.5,0.26),(0.76,0.30),(0.4,0.20),(0.6,0.18)]
        for fx, fy in pts:
            c.circle(cx0 + fx*w, yb + fy*TRIM_H, 1.3, fill=1, stroke=0)

    def gold_frame(cx0, w):
        m = 0.4*inch
        c.setStrokeColor(GOLD); c.setLineWidth(1.6)
        c.rect(cx0+m, yb+m, w-2*m, TRIM_H-2*m, fill=0, stroke=1)

    def draw_paras(paras, cx0, w, top_y):
        y = top_y
        for p in paras:
            pw, ph = p.wrapOn(c, w, TRIM_H)
            p.drawOn(c, cx0 + (w-pw)/2.0, y - ph)
            y -= ph
        return y

    # ---- 1re de couverture (à droite) ----
    fw = TRIM_W
    stars(front_x0, fw, True); gold_frame(front_x0, fw)
    cx = front_x0 + fw/2.0
    c.setFillColor(CREAM); c.setFont("Serif-Italic", 16)
    c.drawCentredString(cx, yb+TRIM_H*0.78, "Lucette Laudumiey")
    c.setFillColor(white); c.setFont("Serif-Bold", 34)
    c.drawCentredString(cx, yb+TRIM_H*0.60, "PLUS HAUT")
    c.drawCentredString(cx, yb+TRIM_H*0.60-42, "QUE LES MURS")
    c.setStrokeColor(GOLD); c.setLineWidth(1.3)
    c.line(front_x0+fw*0.28, yb+TRIM_H*0.50, front_x0+fw*0.72, yb+TRIM_H*0.50)
    c.setFillColor(CREAM); c.setFont("Serif-Italic", 13)
    c.drawCentredString(cx, yb+TRIM_H*0.45, "Un roman en deux tomes sur la jeunesse,")
    c.drawCentredString(cx, yb+TRIM_H*0.45-18, "le respect, l'éducation et le handicap")
    c.setFont("Serif", 11); c.setFillColor(GOLD)
    c.drawCentredString(cx, yb+TRIM_H*0.135, "— Au cœur du Béarn, à Orthez —")

    # ---- 4e de couverture (à gauche) ----
    stars(back_x0, TRIM_W, False); gold_frame(back_x0, TRIM_W)
    pad = 0.7*inch; bw = TRIM_W - 2*pad
    cm = CREAM
    bp = [
        Paragraph("PLUS HAUT QUE LES MURS", ParagraphStyle("bt", fontName="Serif-Bold",
            fontSize=15, alignment=TA_CENTER, textColor=GOLD, leading=19, spaceAfter=2)),
        Paragraph("roman", ParagraphStyle("br", fontName="Serif-Italic", fontSize=11,
            alignment=TA_CENTER, textColor=cm, spaceAfter=16)),
        Paragraph(B.BLURB1, ParagraphStyle("b1", fontName="Serif", fontSize=10.5,
            alignment=TA_CENTER, textColor=cm, leading=15, spaceAfter=9)),
        Paragraph(B.BLURB2, ParagraphStyle("b2", fontName="Serif", fontSize=10.5,
            alignment=TA_CENTER, textColor=cm, leading=15, spaceAfter=18)),
        Paragraph(B.BLURB_Q, ParagraphStyle("bq", fontName="Serif-Italic", fontSize=11,
            alignment=TA_CENTER, textColor=GOLD, leading=15, spaceAfter=18)),
        Paragraph(B.BLURB_INFO, ParagraphStyle("bi", fontName="Serif", fontSize=9.3,
            alignment=TA_CENTER, textColor=cm, leading=13)),
    ]
    draw_paras(bp, back_x0+pad, bw, yb+TRIM_H*0.80)

    # ---- dos (titre + autrice) ----
    if spine >= 0.0625*inch:
        c.saveState(); c.translate(spine_x0+spine/2.0, yb+TRIM_H/2.0); c.rotate(90)
        c.setFillColor(white); c.setFont("Serif-Bold", min(13, spine-4))
        c.drawCentredString(0, -4, "PLUS HAUT QUE LES MURS")
        c.setFillColor(CREAM); c.setFont("Serif-Italic", min(10, spine-6))
        c.drawCentredString(-TRIM_H*0.34, -4, "L. Laudumiey")
        c.restoreState()

    c.showPage(); c.save()
    print("Couverture :", outfile, "-> dos =", round(spine/inch, 3), "in /",
          round(spine/PT*25.4, 1), "mm  (", n_pages, "pages )")

def clean_unembedded_fonts(path):
    """Retire des ressources les polices de base (Helvetica…) non incorporées et
    inutilisées que reportlab ajoute par défaut, pour un PDF 100 % incorporé."""
    import pikepdf
    base14 = ("Helvetica", "Times", "Courier", "Symbol", "ZapfDingbats", "Arial")
    pdf = pikepdf.open(path, allow_overwriting_input=True)
    for page in pdf.pages:
        res = page.get("/Resources")
        if not res or "/Font" not in res:
            continue
        fonts = res["/Font"]
        for name in list(fonts.keys()):
            f = fonts[name]
            bf = str(f.get("/BaseFont", ""))
            desc = f.get("/FontDescriptor")
            embedded = desc is not None and any(k in desc for k in ("/FontFile", "/FontFile2", "/FontFile3"))
            if not embedded and any(b in bf for b in base14):
                del fonts[name]
    pdf.save(path)
    pdf.close()

if __name__ == "__main__":
    interior = "Interieur-Plus-haut-que-les-murs-6x9.pdf"
    cover = "Couverture-Plus-haut-que-les-murs-6x9.pdf"
    n = build_interior(interior, scale=1.13)
    build_cover(cover, n)
    for f in (interior, cover):
        clean_unembedded_fonts(str(BASE / f))
    print("Polices non incorporées retirées.")

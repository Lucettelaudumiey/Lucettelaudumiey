#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Assemble le livre (markdown) en PDF mis en page : couverture colorée,
table des matières cliquable (liens internes + signets), plusieurs formats."""
import re, html, pathlib
from reportlab.lib.pagesizes import A4, A5
from reportlab.lib.units import cm, inch
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER, TA_RIGHT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph,
                                Spacer, PageBreak, NextPageTemplate, Table, TableStyle)

BASE = pathlib.Path(__file__).parent
FILES = [
    "Le-mot-de-l-autrice.md",
    "Remerciements.md",
    "Tome-1-La-rentree-des-differences.md",
    "Tome-2-Plus-haut-que-les-murs.md",
]
BOOK_TITLE = "PLUS HAUT QUE LES MURS"
NAVY, GOLD, CREAM = HexColor("#15324f"), HexColor("#d6a72e"), HexColor("#f2ead6")
LINK = "#1a3a5c"
STARS = [(0.12,0.88),(0.22,0.80),(0.34,0.90),(0.48,0.83),(0.62,0.91),(0.74,0.82),
         (0.86,0.88),(0.18,0.72),(0.82,0.73),(0.30,0.66),(0.70,0.66),(0.50,0.74),
         (0.10,0.55),(0.90,0.55),(0.40,0.36),(0.60,0.33),(0.25,0.28),(0.78,0.30)]

def inline(text):
    text = html.escape(text, quote=False)
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"\*(.+?)\*", r"<i>\1</i>", text)
    return text

def make_styles(s):
    body = ParagraphStyle("body", fontName="Times-Roman", fontSize=11*s, leading=15.8*s,
                          alignment=TA_JUSTIFY, firstLineIndent=14*s, spaceAfter=2*s)
    return dict(
        body=body,
        body0=ParagraphStyle("body0", parent=body, firstLineIndent=0),
        orn=ParagraphStyle("orn", fontName="Times-Roman", fontSize=11*s, alignment=TA_CENTER,
                           textColor="#777777", spaceBefore=8*s, spaceAfter=8*s),
        chap=ParagraphStyle("chap", fontName="Times-Bold", fontSize=15*s, alignment=TA_CENTER,
                            leading=19*s, spaceAfter=22*s, spaceBefore=10*s),
        sect=ParagraphStyle("sect", fontName="Times-Bold", fontSize=17*s, alignment=TA_CENTER,
                            leading=21*s, spaceAfter=24*s, spaceBefore=6*s),
        partt=ParagraphStyle("partt", fontName="Times-Bold", fontSize=24*s, alignment=TA_CENTER,
                             leading=30*s, spaceAfter=10*s),
        tomesub=ParagraphStyle("tomesub", fontName="Times-Italic", fontSize=15*s, alignment=TA_CENTER,
                               leading=20*s, textColor="#333333", spaceAfter=14*s),
        epi=ParagraphStyle("epi", fontName="Times-Italic", fontSize=10.5*s, alignment=TA_CENTER,
                           leading=15*s, textColor="#444444", spaceBefore=4*s, spaceAfter=4*s,
                           leftIndent=18*s, rightIndent=18*s),
        toch=ParagraphStyle("toch", fontName="Times-Bold", fontSize=17*s, alignment=TA_CENTER,
                            leading=21*s, spaceAfter=20*s),
        toc0=ParagraphStyle("toc0", fontName="Times-Bold", fontSize=12*s, leading=16*s),
        toc1=ParagraphStyle("toc1", fontName="Times-Roman", fontSize=11*s, leading=15*s, leftIndent=14*s),
        tocp=ParagraphStyle("tocp", fontName="Times-Roman", fontSize=11*s, leading=15*s, alignment=TA_RIGHT),
    )

HEAD_STYLES = {"sect", "tomesub", "chap"}

def extract_headings():
    """Liste ordonnée (level, text, key) des titres pour la table des matières."""
    out = []
    for name in FILES:
        for raw in (BASE / name).read_text(encoding="utf-8").splitlines():
            s = raw.strip()
            if s.startswith("# "):
                t = s[2:].strip()
                if t.upper() != BOOK_TITLE:
                    out.append([0, t])
            elif s.startswith("## "):
                t = s[3:].strip()
                out.append([0 if t.lower().startswith("tome") else 1, t])
            elif s.startswith("### "):
                out.append([1, s[4:].strip()])
    return [(lv, t, "h%d" % i) for i, (lv, t) in enumerate(out)]

def parse(md, flow, st, PH):
    para, quote = [], []
    pending_hr = [False]; first_para = [True]
    def flush_para():
        if para:
            flow.append(Paragraph(inline(" ".join(para)), st["body0"] if first_para[0] else st["body"]))
            first_para[0] = False; para.clear()
    def flush_quote():
        if quote:
            flow.append(Paragraph("<br/>".join(inline(q) for q in quote), st["epi"])); quote.clear()
    for raw in md.splitlines():
        s = raw.strip()
        if s == "":
            flush_para(); flush_quote(); continue
        if s == "---":
            flush_para(); flush_quote(); pending_hr[0] = True; continue
        if s.startswith("# "):
            flush_para(); flush_quote(); pending_hr[0] = False
            t = s[2:].strip()
            if t.upper() == BOOK_TITLE:
                flow.append(PageBreak()); flow.append(Spacer(1, PH*0.30)); flow.append(Paragraph(t, st["partt"]))
            else:
                flow.append(PageBreak()); flow.append(Paragraph(inline(t), st["sect"]))
            first_para[0] = True; continue
        if s.startswith("## "):
            flush_para(); flush_quote(); pending_hr[0] = False
            t = s[3:].strip()
            if t.lower().startswith("tome"):
                flow.append(Paragraph(inline(t), st["tomesub"]))
            else:
                flow.append(PageBreak()); flow.append(Spacer(1, PH*0.05)); flow.append(Paragraph(inline(t), st["chap"]))
            first_para[0] = True; continue
        if s.startswith("### "):
            flush_para(); flush_quote(); pending_hr[0] = False
            flow.append(PageBreak()); flow.append(Spacer(1, PH*0.05)); flow.append(Paragraph(inline(s[4:].strip()), st["chap"]))
            first_para[0] = True; continue
        if s.startswith(">"):
            flush_para(); quote.append(s.lstrip(">").strip()); continue
        flush_quote()
        if pending_hr[0]:
            flow.append(Paragraph("* * *", st["orn"])); pending_hr[0] = False; first_para[0] = True
        para.append(s)
    flush_para(); flush_quote()

class BookDoc(BaseDocTemplate):
    headings = []
    def __init__(self, *a, **k):
        BaseDocTemplate.__init__(self, *a, **k)
        self._idx = 0; self.pages = {}
    def afterFlowable(self, fl):
        if fl.__class__.__name__ == "Paragraph" and fl.style.name in HEAD_STYLES:
            lv, text, key = self.headings[self._idx]
            self.canv.bookmarkPage(key)
            self.canv.addOutlineEntry(text, key, level=lv, closed=(lv == 0))
            self.pages[self._idx] = self.page
            self._idx += 1

def content_story(st, PH):
    flow = []
    for name in FILES:
        parse((BASE / name).read_text(encoding="utf-8"), flow, st, PH)
    return flow

def toc_block(headings, pages, st, avail, scale):
    rows, cmds = [], [("VALIGN", (0, 0), (-1, -1), "TOP"),
                      ("LEFTPADDING", (0, 0), (-1, -1), 0),
                      ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                      ("TOPPADDING", (0, 0), (-1, -1), 1.5*scale),
                      ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5*scale)]
    for i, (lv, text, key) in enumerate(headings):
        p = pages.get(i, "")
        tstyle = st["toc0"] if lv == 0 else st["toc1"]
        title = '<link destination="%s" color="%s">%s</link>' % (key, LINK, inline(text))
        num = '<link destination="%s" color="%s">%s</link>' % (key, LINK, p)
        rows.append([Paragraph(title, tstyle), Paragraph(num, st["tocp"])])
        if lv == 0 and i > 0:
            cmds.append(("TOPPADDING", (0, i), (-1, i), 9*scale))
    pcol = 1.7*cm
    t = Table(rows, colWidths=[avail - pcol, pcol]); t.setStyle(TableStyle(cmds))
    return [Paragraph("Table des matières", st["toch"]), t]

def build(outfile, pagesize, scale, margin):
    PW, PH = pagesize
    st = make_styles(scale)
    headings = extract_headings()
    avail = PW - 2*margin

    def draw_cover(canvas, doc):
        canvas.saveState()
        canvas.setFillColor(NAVY); canvas.rect(0, 0, PW, PH, fill=1, stroke=0)
        canvas.setFillColor(CREAM)
        for fx, fy in STARS:
            canvas.circle(PW*fx, PH*fy, 1.1*scale, fill=1, stroke=0)
        m = margin*0.55
        canvas.setStrokeColor(GOLD); canvas.setLineWidth(1.6*scale)
        canvas.rect(m, m, PW-2*m, PH-2*m, fill=0, stroke=1)
        canvas.setFillColor(CREAM); canvas.setFont("Times-Italic", 15*scale)
        canvas.drawCentredString(PW/2, PH*0.78, "Lucette Laudumiey")
        canvas.setFillColor(white); canvas.setFont("Times-Bold", 33*scale)
        canvas.drawCentredString(PW/2, PH*0.60, "PLUS HAUT")
        canvas.drawCentredString(PW/2, PH*0.60 - 40*scale, "QUE LES MURS")
        canvas.setStrokeColor(GOLD); canvas.setLineWidth(1.2*scale)
        canvas.line(PW*0.28, PH*0.50, PW*0.72, PH*0.50)
        canvas.setFillColor(CREAM); canvas.setFont("Times-Italic", 13*scale)
        canvas.drawCentredString(PW/2, PH*0.45, "Un roman en deux tomes sur la jeunesse,")
        canvas.drawCentredString(PW/2, PH*0.45 - 18*scale, "le respect, l'éducation et le handicap")
        canvas.setFont("Times-Roman", 11*scale); canvas.setFillColor(GOLD)
        canvas.drawCentredString(PW/2, PH*0.135, "— Au cœur du Béarn, à Orthez —")
        canvas.restoreState()

    def footer(canvas, doc):
        if doc.page > 1:
            canvas.saveState(); canvas.setFont("Times-Roman", 9); canvas.setFillColor(HexColor("#555555"))
            canvas.drawCentredString(PW/2, 1.1*cm, str(doc.page)); canvas.restoreState()

    def make_doc():
        cover_f = Frame(0, 0, PW, PH, id="cover")
        text_f = Frame(margin, margin, PW-2*margin, PH-2*margin, id="text")
        tmpls = [PageTemplate(id="cover", frames=[cover_f], onPage=draw_cover),
                 PageTemplate(id="normal", frames=[text_f], onPage=footer)]
        d = BookDoc(str(BASE / outfile), pagesize=pagesize, pageTemplates=tmpls,
                    title="Plus haut que les murs", author="Lucette Laudumiey")
        d.headings = headings
        return d

    # Passe 1 : mesurer les pages réelles des titres (TdM avec numéros provisoires)
    d1 = make_doc()
    s1 = [NextPageTemplate("normal"), PageBreak()] + toc_block(headings, {}, st, avail, scale) + content_story(st, PH)
    d1.build(s1)
    pages = dict(d1.pages)

    # Passe 2 : TdM finale avec les vrais numéros (mise en page identique -> stable)
    d2 = make_doc()
    s2 = [NextPageTemplate("normal"), PageBreak()] + toc_block(headings, pages, st, avail, scale) + content_story(st, PH)
    d2.build(s2)
    print("PDF écrit :", outfile)

ROMAN_6x9 = (6*inch, 9*inch)

if __name__ == "__main__":
    build("Plus-haut-que-les-murs-Roman-6x9.pdf", ROMAN_6x9, scale=1.06, margin=2.0*cm)
    build("Plus-haut-que-les-murs-GrosCaracteres-A4.pdf", A4, scale=1.5, margin=2.3*cm)
    build("Plus-haut-que-les-murs.pdf", A5, scale=1.0, margin=1.9*cm)

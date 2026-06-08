#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Assemble le livre (markdown) en PDF mis en page. Plusieurs éditions (formats)."""
import re, html, pathlib
from reportlab.lib.pagesizes import A4, A5
from reportlab.lib.units import cm, inch
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, PageBreak)

BASE = pathlib.Path(__file__).parent
FILES = [
    "Le-mot-de-l-autrice.md",
    "Remerciements.md",
    "Tome-1-La-rentree-des-differences.md",
    "Tome-2-Plus-haut-que-les-murs.md",
]
BOOK_TITLE = "PLUS HAUT QUE LES MURS"

def inline(text):
    text = html.escape(text, quote=False)
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"\*(.+?)\*", r"<i>\1</i>", text)
    return text

def make_styles(s):
    """s = facteur d'échelle de la police."""
    body = ParagraphStyle("body", fontName="Times-Roman", fontSize=11*s,
                          leading=15.8*s, alignment=TA_JUSTIFY,
                          firstLineIndent=14*s, spaceAfter=2*s)
    return dict(
        body=body,
        body0=ParagraphStyle("body0", parent=body, firstLineIndent=0),
        orn=ParagraphStyle("orn", fontName="Times-Roman", fontSize=11*s,
                           alignment=TA_CENTER, textColor="#777777",
                           spaceBefore=8*s, spaceAfter=8*s),
        chap=ParagraphStyle("chap", fontName="Times-Bold", fontSize=15*s,
                            alignment=TA_CENTER, leading=19*s, spaceAfter=22*s, spaceBefore=10*s),
        sect=ParagraphStyle("sect", fontName="Times-Bold", fontSize=17*s,
                            alignment=TA_CENTER, leading=21*s, spaceAfter=24*s, spaceBefore=6*s),
        partt=ParagraphStyle("partt", fontName="Times-Bold", fontSize=24*s,
                             alignment=TA_CENTER, leading=30*s, spaceAfter=10*s),
        tomesub=ParagraphStyle("tomesub", fontName="Times-Italic", fontSize=15*s,
                               alignment=TA_CENTER, leading=20*s, textColor="#333333", spaceAfter=14*s),
        epi=ParagraphStyle("epi", fontName="Times-Italic", fontSize=10.5*s,
                           alignment=TA_CENTER, leading=15*s, textColor="#444444",
                           spaceBefore=4*s, spaceAfter=4*s, leftIndent=18*s, rightIndent=18*s),
    )

def parse(md, flow, st):
    para, quote = [], []
    pending_hr = [False]
    first_para = [True]

    def flush_para():
        if para:
            flow.append(Paragraph(inline(" ".join(para)),
                                  st["body0"] if first_para[0] else st["body"]))
            first_para[0] = False
            para.clear()

    def flush_quote():
        if quote:
            flow.append(Paragraph("<br/>".join(inline(q) for q in quote), st["epi"]))
            quote.clear()

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
                flow.append(PageBreak()); flow.append(Spacer(1, PH*0.30))
                flow.append(Paragraph(t, st["partt"]))
            else:
                flow.append(PageBreak())
                flow.append(Paragraph(inline(t), st["sect"]))
            first_para[0] = True; continue
        if s.startswith("## "):
            flush_para(); flush_quote(); pending_hr[0] = False
            t = s[3:].strip()
            if t.lower().startswith("tome"):
                flow.append(Paragraph(inline(t), st["tomesub"]))
            else:
                flow.append(PageBreak()); flow.append(Spacer(1, PH*0.05))
                flow.append(Paragraph(inline(t), st["chap"]))
            first_para[0] = True; continue
        if s.startswith("### "):
            flush_para(); flush_quote(); pending_hr[0] = False
            flow.append(PageBreak()); flow.append(Spacer(1, PH*0.05))
            flow.append(Paragraph(inline(s[4:].strip()), st["chap"]))
            first_para[0] = True; continue
        if s.startswith(">"):
            flush_para(); quote.append(s.lstrip(">").strip()); continue
        flush_quote()
        if pending_hr[0]:
            flow.append(Paragraph("* * *", st["orn"])); pending_hr[0] = False
            first_para[0] = True
        para.append(s)
    flush_para(); flush_quote()

def title_page(flow, s):
    flow.append(Spacer(1, PH*0.16))
    flow.append(Paragraph("Lucette Laudumiey", ParagraphStyle(
        "auth", fontName="Times-Italic", fontSize=14*s, alignment=TA_CENTER, textColor="#444444")))
    flow.append(Spacer(1, PH*0.13))
    flow.append(Paragraph("PLUS HAUT<br/>QUE LES MURS", ParagraphStyle(
        "bigt", fontName="Times-Bold", fontSize=30*s, alignment=TA_CENTER, leading=36*s)))
    flow.append(Spacer(1, PH*0.05))
    flow.append(Paragraph("Un roman en deux tomes sur la jeunesse,<br/>"
                          "le respect, l'éducation et le handicap", ParagraphStyle(
        "subt", fontName="Times-Italic", fontSize=13*s, alignment=TA_CENTER, leading=18*s)))
    flow.append(Spacer(1, PH*0.11))
    flow.append(Paragraph("— Au cœur du Béarn, à Orthez —", ParagraphStyle(
        "plc", fontName="Times-Roman", fontSize=11*s, alignment=TA_CENTER, textColor="#666666")))

def footer_maker(pw):
    def footer(canvas, doc):
        if doc.page > 1:
            canvas.saveState()
            canvas.setFont("Times-Roman", 9)
            canvas.setFillColor("#555555")
            canvas.drawCentredString(pw/2.0, 1.1*cm, str(doc.page - 1))
            canvas.restoreState()
    return footer

def build(outfile, pagesize, scale, margin):
    global PH
    PH = pagesize[1]
    st = make_styles(scale)
    flow = []
    title_page(flow, scale)
    for name in FILES:
        parse((BASE / name).read_text(encoding="utf-8"), flow, st)
    doc = SimpleDocTemplate(str(BASE / outfile), pagesize=pagesize,
                            topMargin=margin, bottomMargin=margin,
                            leftMargin=margin, rightMargin=margin,
                            title="Plus haut que les murs", author="Lucette Laudumiey")
    fb = footer_maker(pagesize[0])
    doc.build(flow, onFirstPage=fb, onLaterPages=fb)
    print("PDF écrit :", outfile)

ROMAN_6x9 = (6*inch, 9*inch)

if __name__ == "__main__":
    # Modèle « Roman » : format livre 6x9 pouces, police standard
    build("Plus-haut-que-les-murs-Roman-6x9.pdf", ROMAN_6x9, scale=1.06, margin=2.0*cm)
    # Modèle « Gros caractères » : A4, grande police (lecture confort)
    build("Plus-haut-que-les-murs-GrosCaracteres-A4.pdf", A4, scale=1.5, margin=2.3*cm)
    # Édition poche A5 (conservée)
    build("Plus-haut-que-les-murs.pdf", A5, scale=1.0, margin=1.9*cm)

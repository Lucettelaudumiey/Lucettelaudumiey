#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Assemble le livre (fichiers markdown) en un PDF mis en page, façon roman."""
import re, html, pathlib
from reportlab.lib.pagesizes import A5
from reportlab.lib.units import cm
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

# ----- styles -----
body = ParagraphStyle("body", fontName="Times-Roman", fontSize=11, leading=15.8,
                      alignment=TA_JUSTIFY, firstLineIndent=14, spaceAfter=2)
body0 = ParagraphStyle("body0", parent=body, firstLineIndent=0)  # 1er paragraphe
orn = ParagraphStyle("orn", fontName="Times-Roman", fontSize=11, alignment=TA_CENTER,
                     textColor="#777777", spaceBefore=8, spaceAfter=8)
chap = ParagraphStyle("chap", fontName="Times-Bold", fontSize=15, alignment=TA_CENTER,
                      leading=19, spaceAfter=22, spaceBefore=10)
sect = ParagraphStyle("sect", fontName="Times-Bold", fontSize=17, alignment=TA_CENTER,
                      leading=21, spaceAfter=24, spaceBefore=6)
partt = ParagraphStyle("partt", fontName="Times-Bold", fontSize=24, alignment=TA_CENTER,
                       leading=30, spaceAfter=10)
tomesub = ParagraphStyle("tomesub", fontName="Times-Italic", fontSize=15,
                         alignment=TA_CENTER, leading=20, textColor="#333333", spaceAfter=14)
epi = ParagraphStyle("epi", fontName="Times-Italic", fontSize=10.5, alignment=TA_CENTER,
                     leading=15, textColor="#444444", spaceBefore=4, spaceAfter=4,
                     leftIndent=18, rightIndent=18)

def inline(text):
    text = html.escape(text, quote=False)
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"\*(.+?)\*", r"<i>\1</i>", text)
    return text

def parse(md, flow):
    para, quote = [], []
    pending_hr = False
    first_para = [True]  # 1er paragraphe après un titre -> pas d'alinéa

    def flush_para():
        if para:
            st = body0 if first_para[0] else body
            flow.append(Paragraph(inline(" ".join(para)), st))
            first_para[0] = False
            para.clear()

    def flush_quote():
        if quote:
            flow.append(Paragraph("<br/>".join(inline(q) for q in quote), epi))
            quote.clear()

    for raw in md.splitlines():
        s = raw.strip()
        if s == "":
            flush_para(); flush_quote(); continue
        if s == "---":
            flush_para(); flush_quote(); pending_hr = True; continue
        if s.startswith("# "):
            flush_para(); flush_quote(); pending_hr = False
            t = s[2:].strip()
            if t.upper() == BOOK_TITLE:
                flow.append(PageBreak()); flow.append(Spacer(1, 5.2*cm))
                flow.append(Paragraph(t, partt))
            else:
                flow.append(PageBreak())
                flow.append(Paragraph(inline(t), sect))
            first_para[0] = True
            continue
        if s.startswith("## "):
            flush_para(); flush_quote(); pending_hr = False
            t = s[3:].strip()
            if t.lower().startswith("tome"):
                flow.append(Paragraph(inline(t), tomesub))
            else:
                flow.append(PageBreak()); flow.append(Spacer(1, 1.1*cm))
                flow.append(Paragraph(inline(t), chap))
            first_para[0] = True
            continue
        if s.startswith("### "):
            flush_para(); flush_quote(); pending_hr = False
            flow.append(PageBreak()); flow.append(Spacer(1, 1.1*cm))
            flow.append(Paragraph(inline(s[4:].strip()), chap))
            first_para[0] = True
            continue
        if s.startswith(">"):
            flush_para()
            quote.append(s.lstrip(">").strip())
            continue
        flush_quote()
        if pending_hr:
            flow.append(Paragraph("* * *", orn)); pending_hr = False
            first_para[0] = True
        para.append(s)
    flush_para(); flush_quote()

# ----- title page + content -----
flow = []
flow.append(Spacer(1, 3.4*cm))
flow.append(Paragraph("Lucette Laudumiey", ParagraphStyle(
    "auth", fontName="Times-Italic", fontSize=14, alignment=TA_CENTER, textColor="#444444")))
flow.append(Spacer(1, 2.6*cm))
flow.append(Paragraph("PLUS HAUT<br/>QUE LES MURS", ParagraphStyle(
    "bigt", fontName="Times-Bold", fontSize=30, alignment=TA_CENTER, leading=36)))
flow.append(Spacer(1, 1.1*cm))
flow.append(Paragraph("Un roman en deux tomes sur la jeunesse,<br/>"
                      "le respect, l'éducation et le handicap", ParagraphStyle(
    "subt", fontName="Times-Italic", fontSize=13, alignment=TA_CENTER, leading=18)))
flow.append(Spacer(1, 2.2*cm))
flow.append(Paragraph("— Au cœur du Béarn, à Orthez —", ParagraphStyle(
    "plc", fontName="Times-Roman", fontSize=11, alignment=TA_CENTER, textColor="#666666")))

for name in FILES:
    parse((BASE / name).read_text(encoding="utf-8"), flow)

def footer(canvas, doc):
    if doc.page > 1:
        canvas.saveState()
        canvas.setFont("Times-Roman", 9)
        canvas.setFillColor("#555555")
        canvas.drawCentredString(A5[0] / 2.0, 1.0*cm, str(doc.page - 1))
        canvas.restoreState()

doc = SimpleDocTemplate(str(BASE / "Plus-haut-que-les-murs.pdf"), pagesize=A5,
                        topMargin=1.8*cm, bottomMargin=1.8*cm,
                        leftMargin=1.9*cm, rightMargin=1.9*cm,
                        title="Plus haut que les murs", author="Lucette Laudumiey")
doc.build(flow, onFirstPage=footer, onLaterPages=footer)
print("PDF écrit :", BASE / "Plus-haut-que-les-murs.pdf")

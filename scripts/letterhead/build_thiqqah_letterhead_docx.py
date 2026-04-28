# -*- coding: utf-8 -*-
"""letterhead-thiqqah.docx — هيدر مدمج (أعلى يمين)، QR أسفل يسار، إطار صفحة، تذييل بخط ذهبي."""
from __future__ import annotations

import io
from pathlib import Path

import qrcode
from docx import Document
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

REPO = Path(__file__).resolve().parents[2]
LOGO_PATH = REPO / "thiqqah-site" / "assets" / "thiqqah-logo.png"
OUT_PATH = REPO / "thiqqah-site" / "letterhead-thiqqah.docx"

SITE_URL = "https://thiqqah.live/"


def set_paragraph_rtl(paragraph) -> None:
    p = paragraph._p
    p_pr = p.get_or_add_pPr()
    bidi = OxmlElement("w:bidi")
    bidi.set(qn("w:val"), "1")
    p_pr.append(bidi)


def add_page_border(section) -> None:
    sect_pr = section._sectPr
    pg_borders = OxmlElement("w:pgBorders")
    for side in ("top", "left", "bottom", "right"):
        el = OxmlElement(f"w:{side}")
        el.set(qn("w:val"), "double")
        el.set(qn("w:sz"), "12")
        el.set(qn("w:space"), "10")
        el.set(qn("w:color"), "A67C2C")
        pg_borders.append(el)
    sect_pr.append(pg_borders)


def format_ar_paragraph(paragraph, *, rtl=True, align=WD_ALIGN_PARAGRAPH.RIGHT) -> None:
    paragraph.paragraph_format.space_after = Pt(3)
    paragraph.alignment = align
    if rtl:
        set_paragraph_rtl(paragraph)


def qr_png_bytes(url: str, box_size: int = 5, border: int = 2) -> bytes:
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=box_size,
        border=border,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0f172a", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def main() -> None:
    if not LOGO_PATH.is_file():
        raise FileNotFoundError(f"الشعار غير موجود: {LOGO_PATH}")

    doc = Document()
    sect = doc.sections[0]
    sect.page_height = Cm(29.7)
    sect.page_width = Cm(21.0)
    sect.top_margin = Cm(2.2)
    sect.bottom_margin = Cm(3.4)
    sect.left_margin = Cm(2.0)
    sect.right_margin = Cm(2.0)
    sect.header_distance = Cm(0.8)
    sect.footer_distance = Cm(0.9)

    add_page_border(sect)

    # رأس الصفحة: أعلى يمين — شعار صغير + اسم + سجل
    header = sect.header
    ht = header.add_table(1, 2, Cm(17))
    ht.autofit = False
    ht.columns[0].width = Cm(13.0)
    ht.columns[1].width = Cm(4.0)
    c_empty, c_brand = ht.rows[0].cells[0], ht.rows[0].cells[1]
    c_empty.text = ""
    c_brand.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.TOP

    p_img = c_brand.paragraphs[0]
    p_img.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    set_paragraph_rtl(p_img)
    p_img.paragraph_format.space_after = Pt(2)
    p_img.add_run().add_picture(str(LOGO_PATH), width=Cm(1.45))

    p_nm = c_brand.add_paragraph()
    format_ar_paragraph(p_nm)
    p_nm.paragraph_format.space_before = Pt(0)
    rnm = p_nm.add_run("مكتب ثقة الذهبية\nللخدمات العامة")
    rnm.bold = True
    rnm.font.size = Pt(11)
    rnm.font.name = "Arial"
    rnm.font.color.rgb = RGBColor(0x15, 0x1F, 0x33)

    p_cr = c_brand.add_paragraph()
    format_ar_paragraph(p_cr)
    rcr = p_cr.add_run("السجل التجاري: 4030506321")
    rcr.font.size = Pt(8.5)
    rcr.font.name = "Arial"
    rcr.font.color.rgb = RGBColor(0x5A, 0x65, 0x78)

    pa = doc.add_paragraph()
    pa.alignment = WD_ALIGN_PARAGRAPH.CENTER
    set_paragraph_rtl(pa)
    ra = pa.add_run("جدة — منطقة مكة المكرمة — المملكة العربية السعودية")
    ra.font.size = Pt(9)
    ra.font.name = "Arial"
    ra.font.color.rgb = RGBColor(0x5A, 0x65, 0x78)
    pa.paragraph_format.space_after = Pt(10)

    meta = doc.add_table(rows=1, cols=3)
    meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i in range(3):
        meta.columns[i].width = Cm(5.65)
    labels_vals = [
        ("التاريخ: ", "    /    /    هـ"),
        ("المرجع: ", "_______________"),
        ("الموضوع: ", "_______________"),
    ]
    for i, (lab, ph) in enumerate(labels_vals):
        c = meta.rows[0].cells[i]
        c.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.TOP
        mp = c.paragraphs[0]
        format_ar_paragraph(mp)
        r0 = mp.add_run(lab)
        r0.bold = True
        r0.font.size = Pt(9.5)
        r0.font.name = "Arial"
        r1 = mp.add_run(ph)
        r1.font.size = Pt(9.5)
        r1.font.name = "Arial"
        r1.font.color.rgb = RGBColor(0x66, 0x66, 0x66)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    intro = doc.add_paragraph()
    format_ar_paragraph(intro)
    ir = intro.add_run("السادة / المحترمون،")
    ir.bold = True
    ir.font.size = Pt(12)
    ir.font.name = "Arial"

    body_hint = doc.add_paragraph()
    format_ar_paragraph(body_hint)
    body_hint.paragraph_format.space_before = Pt(6)
    bh = body_hint.add_run("(اكتب نص الخطاب أو العقد هنا.)")
    bh.italic = True
    bh.font.size = Pt(10.5)
    bh.font.name = "Arial"
    bh.font.color.rgb = RGBColor(0x99, 0x99, 0x99)

    for _ in range(10):
        blank = doc.add_paragraph()
        format_ar_paragraph(blank)
        blank.paragraph_format.space_after = Pt(9)

    close1 = doc.add_paragraph()
    format_ar_paragraph(close1)
    c1 = close1.add_run("وتفضلوا بقبول فائق الاحترام والتقدير،")
    c1.font.size = Pt(11)
    c1.font.name = "Arial"

    sig = doc.add_paragraph()
    format_ar_paragraph(sig)
    sig.paragraph_format.space_before = Pt(20)
    sig_line = sig.add_run("________________________\nالاسم — المسمى الوظيفي")
    sig_line.font.size = Pt(10)
    sig_line.font.name = "Arial"

    footer = sect.footer
    footer_table = footer.add_table(1, 2, Cm(17))
    footer_table.autofit = False
    footer_table.columns[0].width = Cm(3.0)
    footer_table.columns[1].width = Cm(14.0)
    fc_qr, fc_sp = footer_table.rows[0].cells[0], footer_table.rows[0].cells[1]
    fc_qr.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.BOTTOM
    fc_sp.text = ""

    p_qr = fc_qr.paragraphs[0]
    p_qr.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_qr.paragraph_format.space_after = Pt(2)
    p_qr.add_run().add_picture(io.BytesIO(qr_png_bytes(SITE_URL)), width=Cm(2.35))

    p_cap = fc_qr.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.LEFT
    rc = p_cap.add_run("مسح للموقع\nthiqqah.live")
    rc.font.size = Pt(7)
    rc.font.name = "Arial"
    rc.font.color.rgb = RGBColor(0x5A, 0x65, 0x78)

    # خط فاصل فوق بيانات التواصل
    sep = footer.add_table(1, 1, Cm(17))
    sep.autofit = False
    sep.columns[0].width = Cm(17.0)
    sc = sep.rows[0].cells[0]
    tc_pr = sc._tc.get_or_add_tcPr()
    borders = OxmlElement("w:tcBorders")
    top = OxmlElement("w:top")
    top.set(qn("w:val"), "single")
    top.set(qn("w:sz"), "20")
    top.set(qn("w:space"), "0")
    top.set(qn("w:color"), "D4AF37")
    borders.append(top)
    tc_pr.append(borders)
    sc.paragraphs[0].paragraph_format.space_after = Pt(4)

    fp = footer.add_paragraph()
    fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    fr = fp.add_run("thiqqah.live")
    fr.font.size = Pt(9)
    fr.font.name = "Arial"
    fr.font.color.rgb = RGBColor(0x1A, 0x33, 0x52)
    fr.bold = True
    fp.add_run("   ·   ")
    fr2 = fp.add_run("info@thiqqah.live")
    fr2.font.size = Pt(9)
    fr2.font.name = "Arial"
    fr2.font.color.rgb = RGBColor(0x1A, 0x33, 0x52)
    fr2.bold = True
    fp.add_run("   ·   ")
    fr3 = fp.add_run("+966 56 756 6616")
    fr3.font.size = Pt(9)
    fr3.font.name = "Arial"
    fr3.font.color.rgb = RGBColor(0x1A, 0x33, 0x52)
    fr3.bold = True

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    try:
        doc.save(str(OUT_PATH))
        print("Saved:", OUT_PATH)
    except PermissionError:
        alt = OUT_PATH.with_name("letterhead-thiqqah-new.docx")
        doc.save(str(alt))
        print("تعذّر استبدال الملف (قد يكون مفتوحاً في Word). تم الحفظ في:", alt)


if __name__ == "__main__":
    main()

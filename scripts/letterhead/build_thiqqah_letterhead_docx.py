# -*- coding: utf-8 -*-
"""ينشئ letterhead-thiqqah.docx — تنسيق منظم لـ Word مع RTL وشعار وQR."""
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


def add_bottom_border_cell(cell) -> None:
    """حد ذهبي سفلي لخلية (size 1/8 pt × 12 ≈ 1.5pt)."""
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    borders = OxmlElement("w:tcBorders")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "18")
    bottom.set(qn("w:space"), "0")
    bottom.set(qn("w:color"), "B8860B")
    borders.append(bottom)
    tc_pr.append(borders)


def format_ar_paragraph(paragraph, *, rtl=True, align=WD_ALIGN_PARAGRAPH.RIGHT) -> None:
    paragraph.paragraph_format.space_after = Pt(4)
    paragraph.alignment = align
    if rtl:
        set_paragraph_rtl(paragraph)


def add_label_value_run(paragraph, label: str, value: str, *, bold_label=True) -> None:
    format_ar_paragraph(paragraph)
    r1 = paragraph.add_run(label)
    r1.bold = bold_label
    r1.font.size = Pt(10.5)
    r1.font.name = "Arial"
    r2 = paragraph.add_run(value)
    r2.bold = False
    r2.font.size = Pt(10.5)
    r2.font.name = "Arial"
    r2.font.color.rgb = RGBColor(0x3D, 0x4A, 0x5C)


def qr_png_bytes(url: str, box_size: int = 6, border: int = 2) -> bytes:
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
    sect.top_margin = Cm(2.0)
    sect.bottom_margin = Cm(2.0)
    sect.left_margin = Cm(2.0)
    sect.right_margin = Cm(2.0)

    # شريط علوي ملون (مستطيل ذهبي-كحلي) — عبر جدول خلية واحدة
    bar = doc.add_table(rows=1, cols=1)
    bar.alignment = WD_TABLE_ALIGNMENT.CENTER
    bar.autofit = False
    bar.columns[0].width = Cm(17.0)
    cbar = bar.rows[0].cells[0]
    cbar.height = Cm(0.35)
    pbar = cbar.paragraphs[0]
    pbar.paragraph_format.space_after = Pt(0)
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), "1E3A5F")
    cbar._tc.get_or_add_tcPr().append(shd)

    doc.add_paragraph()

    # ترويسة: عمود نصوص | عمود شعار + QR
    hdr = doc.add_table(rows=1, cols=2)
    hdr.autofit = False
    hdr.columns[0].width = Cm(11.2)
    hdr.columns[1].width = Cm(5.8)

    cell_txt = hdr.rows[0].cells[0]
    cell_txt.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.TOP
    cell_img = hdr.rows[0].cells[1]
    cell_img.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.TOP

    p = cell_txt.paragraphs[0]
    format_ar_paragraph(p)
    t = p.add_run("مكتب ثقة الذهبية للخدمات العامة")
    t.bold = True
    t.font.size = Pt(20)
    t.font.name = "Arial"
    t.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    p2 = cell_txt.add_paragraph()
    format_ar_paragraph(p2)
    p2.paragraph_format.space_before = Pt(2)
    tag = p2.add_run(
        "تأسيس الأعمال، التراخيص، والخدمات العامة والمتابعة أمام الجهات ذات العلاقة"
    )
    tag.font.size = Pt(10.5)
    tag.font.name = "Arial"
    tag.font.color.rgb = RGBColor(0x5C, 0x65, 0x78)

    spacer = cell_txt.add_paragraph()
    format_ar_paragraph(spacer)
    spacer.paragraph_format.space_after = Pt(8)

    for label, value in [
        ("العنوان: ", "جدة — منطقة مكة المكرمة — المملكة العربية السعودية"),
        ("الجوال / واتساب: ", "+966 56 756 6616"),
        ("الموقع الإلكتروني: ", "https://thiqqah.live"),
        ("البريد: ", "info@thiqqah.live"),
        ("السجل التجاري: ", "4030506321"),
    ]:
        px = cell_txt.add_paragraph()
        add_label_value_run(px, label, value)

    add_bottom_border_cell(cell_txt)
    add_bottom_border_cell(cell_img)

    # عمود الصور
    pic_p = cell_img.paragraphs[0]
    pic_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pic_p.paragraph_format.space_after = Pt(6)
    pic_p.add_run().add_picture(str(LOGO_PATH), width=Cm(3.2))

    qrp = cell_img.add_paragraph()
    qrp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    qrp.paragraph_format.space_after = Pt(2)
    qrp.add_run().add_picture(io.BytesIO(qr_png_bytes(SITE_URL)), width=Cm(3.2))

    cap = cell_img.add_paragraph()
    cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    format_ar_paragraph(cap, align=WD_ALIGN_PARAGRAPH.CENTER)
    cr = cap.add_run("مسح للوصول إلى الموقع\nthiqqah.live")
    cr.font.size = Pt(8)
    cr.font.name = "Arial"
    cr.font.color.rgb = RGBColor(0x88, 0x77, 0x55)

    doc.add_paragraph()

    # صف بيانات الوثيقة
    meta = doc.add_table(rows=1, cols=3)
    for i in range(3):
        meta.columns[i].width = Cm(5.65)
    labels_vals = [
        ("التاريخ: ", "        /        /        هـ"),
        ("المرجع: ", "________________"),
        ("الموضوع: ", "________________"),
    ]
    for i, (lab, ph) in enumerate(labels_vals):
        c = meta.rows[0].cells[i]
        c.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.TOP
        mp = c.paragraphs[0]
        format_ar_paragraph(mp)
        mp.paragraph_format.space_after = Pt(2)
        r0 = mp.add_run(lab)
        r0.bold = True
        r0.font.size = Pt(10)
        r0.font.name = "Arial"
        r1 = mp.add_run(ph)
        r1.font.size = Pt(10)
        r1.font.name = "Arial"
        r1.font.color.rgb = RGBColor(0x66, 0x66, 0x66)

    doc.add_paragraph()

    intro = doc.add_paragraph()
    format_ar_paragraph(intro)
    intro_run = intro.add_run("السادة / المحترمون،")
    intro_run.bold = True
    intro_run.font.size = Pt(12)
    intro_run.font.name = "Arial"

    body_hint = doc.add_paragraph()
    format_ar_paragraph(body_hint)
    body_hint.paragraph_format.space_before = Pt(8)
    bh = body_hint.add_run(
        "(اكتب نص الخطاب أو العقد هنا — يمكنك حذف هذا السطر.)"
    )
    bh.italic = True
    bh.font.size = Pt(11)
    bh.font.name = "Arial"
    bh.font.color.rgb = RGBColor(0x99, 0x99, 0x99)

    for _ in range(8):
        blank = doc.add_paragraph()
        format_ar_paragraph(blank)
        blank.paragraph_format.space_after = Pt(10)

    close1 = doc.add_paragraph()
    format_ar_paragraph(close1)
    c1 = close1.add_run("وتفضلوا بقبول فائق الاحترام والتقدير،")
    c1.font.size = Pt(11)
    c1.font.name = "Arial"

    sig = doc.add_paragraph()
    format_ar_paragraph(sig)
    sig.paragraph_format.space_before = Pt(24)
    sig_line = sig.add_run("________________________\nالاسم — المسمى الوظيفي")
    sig_line.font.size = Pt(10.5)
    sig_line.font.name = "Arial"

    doc.add_paragraph()
    foot = doc.add_paragraph()
    foot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    set_paragraph_rtl(foot)
    foot.paragraph_format.space_before = Pt(18)
    fx = foot.add_run(
        "مكتب ثقة الذهبية للخدمات العامة — السجل التجاري: 4030506321 — "
        "thiqqah.live — info@thiqqah.live"
    )
    fx.font.size = Pt(8)
    fx.font.name = "Arial"
    fx.font.color.rgb = RGBColor(0x88, 0x88, 0x88)

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(OUT_PATH))
    print(f"تم الحفظ: {OUT_PATH}")


if __name__ == "__main__":
    main()

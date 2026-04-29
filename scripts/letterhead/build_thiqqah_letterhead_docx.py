# -*- coding: utf-8 -*-
"""
توليد letterhead-thiqqah.docx — هوية ثقة (ألوان الموقع)، شعار بارز يمين، تذييل QR + تواصل.
الجسم: صفحات كتابة فارغة فقط (فقرات فارغة للتباعد).
"""
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

# ألوان موقع thiqqah (قريبة من index.html)
CLR_INK = RGBColor(0x12, 0x24, 0x3A)
CLR_GREEN = RGBColor(0x07, 0x3F, 0x3A)
CLR_GREEN2 = RGBColor(0x0A, 0x66, 0x5D)
CLR_GOLD = RGBColor(0xBD, 0x91, 0x44)
CLR_MUTED = RGBColor(0x5F, 0x6D, 0x7F)


def set_paragraph_rtl(paragraph) -> None:
    p = paragraph._p
    p_pr = p.get_or_add_pPr()
    bidi = OxmlElement("w:bidi")
    bidi.set(qn("w:val"), "1")
    p_pr.append(bidi)


def format_ar_paragraph(paragraph, *, rtl=True, align=WD_ALIGN_PARAGRAPH.RIGHT) -> None:
    paragraph.paragraph_format.space_after = Pt(2)
    paragraph.alignment = align
    if rtl:
        set_paragraph_rtl(paragraph)


def add_page_border(section) -> None:
    sect_pr = section._sectPr
    pg_borders = OxmlElement("w:pgBorders")
    for side in ("top", "left", "bottom", "right"):
        el = OxmlElement(f"w:{side}")
        el.set(qn("w:val"), "double")
        el.set(qn("w:sz"), "14")
        el.set(qn("w:space"), "8")
        el.set(qn("w:color"), "073F3A")
        pg_borders.append(el)
    sect_pr.append(pg_borders)


def qr_png_bytes(url: str) -> bytes:
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=5,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#073f3a", back_color="white")
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
    sect.bottom_margin = Cm(3.5)
    sect.left_margin = Cm(2.0)
    sect.right_margin = Cm(2.0)
    sect.header_distance = Cm(0.75)
    sect.footer_distance = Cm(0.85)
    add_page_border(sect)

    # ——— رأس مدمج: شعار يمين + نص (حجم أصغر ≈ نصف المساحة السابقة) ———
    header = sect.header
    ht = header.add_table(1, 2, Cm(17.0))
    ht.columns[0].width = Cm(11.8)
    ht.columns[1].width = Cm(5.2)
    c_text, c_logo = ht.rows[0].cells[0], ht.rows[0].cells[1]
    c_text.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    c_logo.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER

    c_logo.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
    set_paragraph_rtl(c_logo.paragraphs[0])
    c_logo.paragraphs[0].paragraph_format.space_after = Pt(0)
    c_logo.paragraphs[0].add_run().add_picture(str(LOGO_PATH), width=Cm(2.35))

    p1 = c_text.paragraphs[0]
    format_ar_paragraph(p1)
    p1.paragraph_format.space_after = Pt(1)
    r1 = p1.add_run("مكتب ثقة الذهبية\nللخدمات العامة")
    r1.bold = True
    r1.font.size = Pt(13)
    r1.font.name = "Arial"
    r1.font.color.rgb = CLR_GREEN

    p2 = c_text.add_paragraph()
    format_ar_paragraph(p2)
    p2.paragraph_format.space_after = Pt(1)
    r2 = p2.add_run("السجل التجاري: 4030506321")
    r2.font.size = Pt(9)
    r2.font.name = "Arial"
    r2.bold = True
    r2.font.color.rgb = CLR_INK

    p3 = c_text.add_paragraph()
    format_ar_paragraph(p3)
    r3 = p3.add_run("جدة — منطقة مكة المكرمة — المملكة العربية السعودية")
    r3.font.size = Pt(8.5)
    r3.font.name = "Arial"
    r3.font.color.rgb = CLR_MUTED

    # خط ذهبي تحت الهيدر (خلية عرض كامل في الهيدر)
    rule = header.add_table(1, 1, Cm(17.0))
    rc = rule.rows[0].cells[0]
    tcp = rc._tc.get_or_add_tcPr()
    borders = OxmlElement("w:tcBorders")
    bot = OxmlElement("w:bottom")
    bot.set(qn("w:val"), "single")
    bot.set(qn("w:sz"), "18")
    bot.set(qn("w:color"), "BD9144")
    borders.append(bot)
    tcp.append(borders)
    rc.paragraphs[0].paragraph_format.space_after = Pt(3)

    # ——— جسم: فارغ للكتابة ———
    for _ in range(22):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(11)
        p.paragraph_format.line_spacing = Pt(14)

    # ——— تذييل: QR يسار + خط + تواصل ———
    footer = sect.footer
    ft = footer.add_table(1, 2, Cm(17.0))
    ft.columns[0].width = Cm(3.2)
    ft.columns[1].width = Cm(13.8)
    f_qr, f_sp = ft.rows[0].cells[0], ft.rows[0].cells[1]
    f_qr.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.BOTTOM
    f_sp.text = ""

    pq = f_qr.paragraphs[0]
    pq.alignment = WD_ALIGN_PARAGRAPH.LEFT
    pq.paragraph_format.space_after = Pt(2)
    pq.add_run().add_picture(io.BytesIO(qr_png_bytes(SITE_URL)), width=Cm(2.05))

    pc = f_qr.add_paragraph()
    pc.alignment = WD_ALIGN_PARAGRAPH.LEFT
    rcap = pc.add_run("thiqqah.live")
    rcap.font.size = Pt(7)
    rcap.font.name = "Arial"
    rcap.font.color.rgb = CLR_GREEN2

    sep = footer.add_table(1, 1, Cm(17.0))
    sc = sep.rows[0].cells[0]
    stc = sc._tc.get_or_add_tcPr()
    sb = OxmlElement("w:tcBorders")
    st = OxmlElement("w:top")
    st.set(qn("w:val"), "single")
    st.set(qn("w:sz"), "20")
    st.set(qn("w:color"), "BD9144")
    sb.append(st)
    stc.append(sb)
    sc.paragraphs[0].paragraph_format.space_after = Pt(4)

    fp = footer.add_paragraph()
    fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for i, (txt, bold) in enumerate(
        [
            ("thiqqah.live", True),
            ("   ·   ", False),
            ("info@thiqqah.live", True),
            ("   ·   ", False),
            ("+966 56 756 6616", True),
        ]
    ):
        rr = fp.add_run(txt)
        rr.font.size = Pt(9)
        rr.font.name = "Arial"
        rr.font.color.rgb = CLR_GREEN2
        rr.bold = bold

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

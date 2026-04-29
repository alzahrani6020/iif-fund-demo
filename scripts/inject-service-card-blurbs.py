# -*- coding: utf-8 -*-
"""Inject per-service card blurbs (AR+EN) into thiqqah-site/index.html translations + SERVICE_CARD_BLURB_AR."""
from pathlib import Path

def esc_js(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


# Arabic blurbs end with same disclaimer; tone: warm, professional, honest (no false guarantees).
SUFFIX_AR = " الرابط أدناه للاطلاع الرسمي فقط، وليس بديلاً عن التنسيق مع ثقة الذهبية."
SUFFIX_EN = " The link below is for official reference only—not a substitute for coordination through Thiqah Golden."

BLURBS_AR_OPEN = {
    "تأسيس الشركات": "نخطّ معكم مسار التأسيس بهدوء واحتراف؛ نوضّح الشكل النظامي بما يلائم نشاطكم دون وعود زائفة، وننسّق الملفات لتقليل المراجع غير المكتملة.",
    "التراخيص والبلدية": "مواءمة النشاط مع اشتراطات البلدية والبيئة يستحق تركيزاً وهدوءاً؛ نتابع لكم حتى لا يضيع وقتكم بين نواقص وتعديلات متكررة.",
    "الخدمات العامة": "بين جهات متعددة، نصنع لكم خيطاً واحداً ولمن تعنونهم؛ شفافية في التنسيق واحترام كامل لاختصاص كل جهة رسمية.",
    "خدمات ما بعد التأسيس": "بعد السجل والرخص، نكمّل معكم التشغيل بروية؛ نرتّب التحديثات والملفات كي يبقى عملكم أنيقاً ومستداماً.",
    "الشركات الأجنبية": "للمستثمر القادم من خارج المملكة، نُخفّف الغموض بلغة صادقة ومسار واضح؛ نقربكم من المتطلبات دون أن نعد بنتيجة من أي جهة.",
    "خدمات الامتثال": "الامتثال مسؤولية يومية؛ نساعدكم على قراءة متطلباتها بهدوء وتنظيم، دون أن نزعم أننا جهة رقابية.",
    "تطوير ومتابعة الأعمال": "تنمية الأعمال تحتاج نظام متابعة لا مجرد أفكار؛ نرتّب أولوياتكم مع الواقع التشغيلي بلغة عملية واثقة.",
    "إدارة الأملاك": "للأملاك قيمة وأمانة؛ ننظّم بياناتكم وعقودكم لتبقى متابعة القيمة والالتزام أسهل على قلب مطمئن.",
    "إدارة المشاريع": "المشاريع تتحرك بين جهات وتوريد؛ نضع لكم خطة متابعة وتقارير مختصرة لتشعرُوا بالسيطرة لا بالضياع.",
    "خدمات الموارد البشرية": "الموارد البشرية جسر بين المنشأة وفرقها؛ نُحسّن الترتيب الداخلي بلغة مهنية دافئة لا صدامية.",
    "خدمات الأفراد": "معاملاتكم الشخصية تستحق احتراماً ووقتاً؛ نمشي معكم خطوة بخطوة دون استعجال يُرهقكم.",
    "متابعة شهرية للمنشآت": "متابعة شهرية تعني أن ملفكم لا ينام؛ نذكّركم بلطف بالمواعيد ونرتّب الطلبات قبل أن تتراكم.",
    "خدمات المستثمر الأجنبي": "استثماركم يستحق طمأنة؛ نوازن بين الشفافية والسرعة، دون أن نبيع أحلاماً غير واقعية.",
    "إدارة ملفات المنشأة": "ملف المنشأة مرآة عملكم؛ نرتّبه ليكون جاهزاً لكل مراجعة بثقة لا تكلّف زائدة.",
    "إدارة علاقات الموردين": "علاقات الموردين تحتاج توثيقاً ولُطفاً في المخاطبات؛ ننسّق الحوار كي لا يضيع الطلب بين الطرفين.",
    "متابعة المطالبات المالية": "المطالبات المالية حسّاسة؛ نتابعها منظّمة وبصراحة حول ما يمكن إنجازه أمام الجهات المعنية.",
    "خدمات المرافق والتشغيل": "الكهرباء والماء والاتصالات خط حياة تشغيلكم؛ نُبسّط التنسيق مع جهات الخدمة بلغة هادئة وواثقة.",
    "القضايا والتنفيذ التجاري": "المسارات العدلية تحتاج صبراً وترتيباً؛ نساعدكم على الإمساك بجدولكم والمواعيد دون إيهام قضائي.",
    "خدمات القطاعات الصحية والحج": "الصحة والحج لهما حسّ خاص؛ نرتّب المتطلبات بقدر من الإنسانية والالتزام بالإجراءات الرسمية.",
    "العلامات التجارية والتسويق": "العلامة جزء من حضوركم؛ نتابع ملفاتها باهتمام لا يُفرط في التسويق على حساب الدقة.",
    "الجمارك والزكاة والضريبة": "الجمارك والضرائب تفرض دقة أرقام؛ نواكبكم بهدوء وبيانات منظّمة تقلّل المفاجآت غير المريحة.",
    "النقل والمواصلات": "النقل والتشغيل يمرّان عبر تصاريح؛ نُبعد عنكم الفوضى الإدارية ونوضّح الخطوات بثقة عملية.",
    "الإعلام والترفيه والفعاليات": "الإعلام والفعاليات تحتاج تناغماً مع الجهات؛ ننسّق المطلوب بلمسة احترافية ومسؤولة.",
    "الصناعة والثروة المعدنية": "الصناعة والمدن الصناعية عالم بحد ذاته؛ نقربكم من المتطلبات التشغيلية بلغة واضحة لا تقنية مبالغ فيها.",
    "خدمات الأسر المنتجة": "للأسر المنتجة قصة يستحق أهلها أن يُسمعوا؛ نساندكم في الترتيب الرسمي بلطف وبصراحة عن المتاح.",
    "خدمات ذوي الاحتياجات الخاصة": "لذوي الاحتياجات الخاصة نقدّم تعاملاً يحترم الكرامة أولاً؛ نتابع الطلبات بهدوء وبلا استعجال مؤذٍ.",
    "خدمات كبار السن": "كبار السن يستحقون يداً حانية؛ نُبسّط المعاملات مع الجهات بلطف وتنسيق واضح.",
    "خدمات الجمعيات": "الجمعيات تحمل مسؤولية مجتمعية؛ نرتّب مخاطباتكم مع الجهات بصدق يقوّي الثقة بينكم وبين المنظمين.",
    "المقايضات والتسويات التجارية": "التسويات تحتاج هدوءاً تجارياً؛ نسعى لترتيب الإجراءات بلغة عملية دون وعود قطعية من المحاكم.",
    "خدمات التعليم في الخارج": "دراسة الأبناء خارج المملكة تشغل القلب قبل الورق؛ ننسّق القبول والمستندات بحنين عملي ومسؤولية.",
    "تأشيرات السفر للخارج": "تأشيرة السفر تحمل أمنيات؛ نرتّب المتطلبات والقنوات القنصلية بصدق حول المواعيد والاحتمالات.",
}

BLURBS_EN = {
    "تأسيس الشركات": "We guide incorporation calmly and professionally—clarifying the legal form that fits your activity without inflated promises, and coordinating files to reduce incomplete rounds.",
    "التراخيص والبلدية": "Aligning your activity with municipal and environmental requirements deserves focus and calm—we follow through so your time is not lost between gaps and repeated revisions.",
    "الخدمات العامة": "Across multiple entities, we create one clear thread for you and those you care about—transparent coordination while respecting each authority’s mandate.",
    "خدمات ما بعد التأسيس": "After the CR and licenses, we continue with you operationally—organizing updates and files so your business stays orderly and sustainable.",
    "الشركات الأجنبية": "For investors arriving from abroad, we reduce ambiguity with honest language and a clear path—bringing requirements closer without promising outcomes from any authority.",
    "خدمات الامتثال": "Compliance is a daily responsibility—we help you read requirements calmly and systematically, without claiming to be a regulator.",
    "تطوير ومتابعة الأعمال": "Growing a business needs follow-up discipline, not slogans—we align priorities with operational reality in practical, confident language.",
    "إدارة الأملاك": "Properties carry value and trust—we organize your data and contracts so stewardship and obligations feel lighter on the heart.",
    "إدارة المشاريع": "Projects move across entities and suppliers—we give you a follow-up plan and brief reports so you feel in control, not lost.",
    "خدمات الموارد البشرية": "HR bridges your establishment and its teams—we refine internal structure with professional warmth, not friction.",
    "خدمات الأفراد": "Personal transactions deserve respect and time—we walk with you step by step without rushing you unnecessarily.",
    "متابعة شهرية للمنشآت": "Monthly follow-up means your file never sleeps—we gently remind you of deadlines and organize requests before they pile up.",
    "خدمات المستثمر الأجنبي": "Your investment deserves reassurance—we balance transparency and speed without selling unrealistic dreams.",
    "إدارة ملفات المنشأة": "Your establishment file mirrors your operation—we organize it so reviews meet confidence without unnecessary overhead.",
    "إدارة علاقات الموردين": "Supplier relationships need documentation and courteous correspondence—we coordinate dialogue so requests do not fall between parties.",
    "متابعة المطالبات المالية": "Financial claims are sensitive—we pursue them in an orderly way, honestly framing what can be advanced before relevant entities.",
    "خدمات المرافق والتشغيل": "Electricity, water, and telecom are lifelines—we simplify coordination with service providers in calm, confident language.",
    "القضايا والتنفيذ التجاري": "Judicial paths require patience and order—we help you hold your schedule and deadlines without offering legal illusions.",
    "خدمات القطاعات الصحية والحج": "Health and Hajj deserve special care—we arrange requirements with humanity while respecting official procedures.",
    "العلامات التجارية والتسويق": "Your brand is part of your presence—we follow trademark files with care, without hype over precision.",
    "الجمارك والزكاة والضريبة": "Customs and taxes demand numerical accuracy—we accompany you calmly with organized data to reduce unpleasant surprises.",
    "النقل والمواصلات": "Transport and operations move through permits—we reduce administrative noise and clarify steps with practical confidence.",
    "الإعلام والترفيه والفعاليات": "Media and events require alignment with regulators—we coordinate requirements with a professional, responsible touch.",
    "الصناعة والثروة المعدنية": "Industry and industrial cities are a world of their own—we bring operational requirements closer in plain language, not overstuffed jargon.",
    "خدمات الأسر المنتجة": "Productive households have stories worth hearing—we support official arrangements kindly and honestly about what is feasible.",
    "خدمات ذوي الاحتياجات الخاصة": "For people with disabilities, dignity comes first—we follow requests calmly and avoid harmful rushing.",
    "خدمات كبار السن": "Seniors deserve a caring hand—we simplify transactions with authorities gently and with clear coordination.",
    "خدمات الجمعيات": "Associations carry community responsibility—we organize correspondence with authorities sincerely to strengthen mutual trust.",
    "المقايضات والتسويات التجارية": "Settlements need commercial calm—we organize procedures practically without promising court outcomes.",
    "خدمات التعليم في الخارج": "Studying abroad weighs on the heart before paperwork—we coordinate admissions and documents with practical care and responsibility.",
    "تأشيرات السفر للخارج": "Travel visas carry hopes—we arrange requirements and consular channels honestly about timelines and likelihoods.",
}


def main() -> None:
    base = Path(__file__).resolve().parents[1]
    path = base / "thiqqah-site/index.html"
    html = path.read_text(encoding="utf-8")

    old_trans = """      "نسهم بتنسيق الملفات والمتابعة أمام الجهات؛ الرابط أدناه للاطلاع الرسمي فقط، وليس بديلاً عن التنسيق عبر ثقة الذهبية.":
        "We coordinate files and follow-ups with authorities. The link below is for official reference only—not a substitute for coordination through Thiqah Golden.",
"""

    trans_lines = []
    for title, open_ar in BLURBS_AR_OPEN.items():
        full_ar = open_ar + SUFFIX_AR
        full_en = BLURBS_EN[title] + SUFFIX_EN
        trans_lines.append(f'      "{esc_js(full_ar)}":\n        "{esc_js(full_en)}",')

    new_trans_block = "\n".join(trans_lines) + "\n"

    if old_trans not in html:
        raise SystemExit("old translations block not found")
    html = html.replace(old_trans, new_trans_block, 1)

    old_js = """    const SERVICE_VALUE_PROP_AR =
      "نسهم بتنسيق الملفات والمتابعة أمام الجهات؛ الرابط أدناه للاطلاع الرسمي فقط، وليس بديلاً عن التنسيق عبر ثقة الذهبية.";
    const SERVICE_OFFICIAL_KICKER_AR = "مصدر رسمي للاطلاع";
"""

    js_lines = ['    const SERVICE_CARD_BLURB_AR = {']
    for title in BLURBS_AR_OPEN:
        full_ar = BLURBS_AR_OPEN[title] + SUFFIX_AR
        js_lines.append(f'      "{esc_js(title)}": "{esc_js(full_ar)}",')
    js_lines.append("    };")
    js_lines.append(
        '    const SERVICE_CARD_BLURB_FALLBACK_AR = "نسهم بتنسيق ملفاتكم ومتابعة الجهات بلغة صادقة؛ الرابط أدناه للاطلاع الرسمي فقط، وليس بديلاً عن التنسيق مع ثقة الذهبية.";'
    )
    js_lines.append('    const SERVICE_OFFICIAL_KICKER_AR = "مصدر رسمي للاطلاع";')

    new_js = "\n".join(js_lines) + "\n"

    if old_js not in html:
        raise SystemExit("old SERVICE_VALUE_PROP_AR block not found")
    html = html.replace(old_js, new_js, 1)

    old_assign = "      valueP.textContent = SERVICE_VALUE_PROP_AR;"
    new_assign = "      valueP.textContent = SERVICE_CARD_BLURB_AR[title] || SERVICE_CARD_BLURB_FALLBACK_AR;"
    if old_assign not in html:
        raise SystemExit("valueP assignment not found")
    html = html.replace(old_assign, new_assign, 1)

    # Fallback translation
    fb_ar = 'نسهم بتنسيق ملفاتكم ومتابعة الجهات بلغة صادقة؛ الرابط أدناه للاطلاع الرسمي فقط، وليس بديلاً عن التنسيق مع ثقة الذهبية.'
    fb_en = "We coordinate your files and authority follow-up with sincere clarity. The link below is for official reference only—not a substitute for coordination through Thiqah Golden."
    fb_entry = f'      "{esc_js(fb_ar)}":\n        "{esc_js(fb_en)}",\n'

    marker = '      "مصدر رسمي للاطلاع": "Official reference (information only)",\n'
    if marker not in html:
        raise SystemExit("marker before مصدر not found")
    html = html.replace(marker, fb_entry + marker, 1)

    path.write_text(html, encoding="utf-8")
    print("Patched blurbs:", len(BLURBS_AR_OPEN), "cards + fallback")


if __name__ == "__main__":
    main()

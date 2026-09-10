# AFAQ Intelligence Core (AIC) — Governed Memory Nucleus

نواة ذاكرة معزولة ومحكومة، مستقلة تمامًا: بدون إطار ويب، بدون شبكة،
standard library فقط (Python ≥ 3.11). لا يوجد أي ربط بإنتاج Afaq بعد —
انظر «خطة الربط» في الأسفل.

## الطبقات

| الملف | الدور |
|---|---|
| `aic_memory_contracts.py` | الأنواع: `MemoryType`, `MemoryState`, `MemoryScope`, `MemoryEvidence`, `MemoryRecord`, `MemoryAuditEvent`, `LessonValidationResult` |
| `aic_memory_store.py` | `MemoryStore`: قفل مركزي، انتقالات CAS ذرّية، audit trail لا يُمحى |
| `aic_persistence.py` | `SqliteMemoryStore`: نفس العقود مع ديمومة SQLite (غير موصول بالإنتاج) |
| `aic_retrieval.py` | `MemoryQuery` / `MemoryHit` / `MemoryRetrieval.search`: بحث حتمي الترتيب |
| `aic_evaluation.py` | `evaluate_record`, `validate_lesson`, `reflect`: قواعد حتمية (مستوى استقلال 0–1) |
| `aic_memory_service.py` | `MemoryService`: واجهة الحوكمة الوحيدة للمستدعين |

## الحدود (Boundaries)

كل ذاكرة ملزمة بـ `MemoryScope(tenant_id, project_id, agent_id, environment)`:

- tenant/project/environment حدود صلبة: الاسترجاع والدروس عبر الحدود مرفوض.
- agent_id يفصل الوكلاء داخل مشروع واحد (`same_boundary()` يسمح بالتعلم
  داخل المشروع الواحد فقط).

## دورة الحياة

```
ACTIVE ──supersede──▶ SUPERSEDED   (السجل يبقى، ويُشار إليه بالـ supersedes)
ACTIVE ──invalidate──▶ INVALIDATED (يتطلب reason؛ idempotent؛ لا يُقبل بعد supersede)
```

- الانتقالات تتم عبر `store.transition(..., expected=(...))` — CAS ذرّي تحت
  قفل واحد. لا يوجد أي مسار يتجاوز الـ abstraction أو الـ locking.
- `MemoryRecord` frozen: لا تعديل في الموضع (in-place) إطلاقًا؛ التحديث =
  نسخة جديدة + حالة جديدة.

## Audit Trail

- كل CREATED/SUPERSEDED/INVALIDATED يُلحق حدث `MemoryAuditEvent` (actor + detail).
- لا يوجد API لتعديل أو حذف الأحداث؛ الترتيب بـ `seq` متزايد رتيب
  (أقوى من الطوابع الزمنية التي قد تتطابق).
- يتوفر في SQLite أيضًا (جدول `memory_audit` بـ AUTOINCREMENT).

## الاسترجاع (Retrieval)

```python
hits = service.search(MemoryQuery(
    scope=scope,                  # إلزامي للخدمات؛ None للأدوات الإدارية فقط
    memory_type=MemoryType.LESSON,
    tags=("validation",),
    min_confidence=0.5,
    limit=10,
))
```

الترتيب حتمي: `score = mean_confidence × type_weight + recency_bonus`.

## التقييم والدروس (Level 0–1 فقط)

- `validate_lesson(store, candidate)`: يقبل/يرفض مع أسباب مجمعة. شرط القبول:
  `reflection` غير فارغة، `derived_from` موجود ونوعه EXPERIENCE/FAILURE/DECISION،
  غير INVALIDATED، ضمن نفس الحدود، وثقة ≥ 0.5.
- `service.create(memory_type=LESSON, ...)` يشغّل التحقق تلقائيًا ويرفض
  برفع `ValueError`.
- `reflect(store, scope)`: ملخص ملاحظة (counts, tags, فشلات بلا دروس مستفادة).

## التشغيل والاختبار

```bash
cd afaq-creative
python -m unittest afaq_intelligence_core.test_aic_memory -v
```

26 اختبارًا: create / retrieve / supersede / invalidate / CAS conflict /
persistence (SQLite round-trip) / isolation (tenant + environment) /
retrieval / evaluation / audit append-only.

## خطة الربط (لا تُنفذ قبل الاعتماد)

1. **المالك**: من يملك تخزين الذاكرة في إنتاج Afaq (SQLite منفصل؟ جدول في
   Postgres الحالية؟) — يتطلب قرار معماري.
2. **الترحيلات**: ملكية مخطط `memories`/`memory_audit` ونسخ احتياطي وسياسة احتفاظ.
3. **التكامل**: حقن `SqliteMemoryStore(path)` في `MemoryService` داخل API
   route محمي (نفس نمط `requireAdmin` الموجود)، مع `actor` = معرف المشرف.
4. **المرحلة التالية المخططة**: فحص AIC + فحص المشروع + لوحة تحكم الذاكرة
   والتعلم والتقييم — تصميم منفصل قبل أي بناء.

## ما لا يزال ناقصًا

- مزامنة/قفل بين عدة عمليات (النواة مصممة لعملية واحدة؛ SQLite يتحمل
  عدة قراء مع كاتب واحد).
- تصدير/استيراد وترحيلات مخطط عند اختيار قاعدة إنتاج.
- فلترة retrieval المتقدمة (full-text) عند الحاجة الفعلية.

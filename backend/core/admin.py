# لوحة تحكم Django — المنشآت، القيود، ميزان المراجعة

from django.contrib import admin
from .models import Entity, DocumentSequence, SystemSettings, JournalEntry, TrialBalanceRow


@admin.register(Entity)
class EntityAdmin(admin.ModelAdmin):
    list_display = ('name', 'vat_number', 'period_type', 'year')


@admin.register(DocumentSequence)
class DocumentSequenceAdmin(admin.ModelAdmin):
    list_display = ('prefix', 'next_number', 'year')


@admin.register(SystemSettings)
class SystemSettingsAdmin(admin.ModelAdmin):
    list_display = ('vat_rate', 'tax_id', 'default_role')


@admin.register(JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):
    list_display = ('doc_number', 'date', 'account_name', 'account_type', 'debit', 'credit', 'entered_by_name', 'approved_by_name')
    list_filter = ('account_type', 'date')


@admin.register(TrialBalanceRow)
class TrialBalanceRowAdmin(admin.ModelAdmin):
    list_display = ('name', 'account_type', 'debit', 'credit')

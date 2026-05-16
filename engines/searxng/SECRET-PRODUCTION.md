# مفتاح SearXNG (`secret_key`) — التطوير مقابل الإنتاج

القيمة في `config/settings.yml` مخصّصة **للتطوير المحلي** ولا يُنصح باستخدامها لمثيل SearXNG **معرّض للإنترنت**.

## قبل تعريض المحرك للعام

1. أنشئ مفتاحاً عشوائياً (مثلاً 32 بايت hex):

```bash
openssl rand -hex 32
```

2. ضع الناتج في `settings.yml`:

```yaml
server:
  secret_key: "الصق_الناتج_هنا"
```

3. أعد تشغيل الحاوية:

```bash
docker compose down && docker compose up -d
```

4. راجع أيضاً `limiter` و`base_url` وHTTPS في [وثائق SearXNG](https://docs.searxng.org/).
5. لنشر VPS جاهز (Docker + Caddy): [deploy/README-VPS.md](./deploy/README-VPS.md).

---

لا ترفع مفتاح إنتاج حقيقي إلى مستودع عام إن كان المستودع مفتوحاً — استخدم متغيرات بيئة أو ملفات محلية مستثناة من Git إن لزم.

export function render() {
  return `<div class="dashboard-letters" id="dashboard-uploads">
          <h3 class="dashboard-letters__title lang-en">Received uploads — view & distribute to specialists</h3>
          <h3 class="dashboard-letters__title lang-ar">الرفوعات المستلمة — الاطلاع والتوزيع على المختصين</h3>
          <p class="dashboard-letters__intro lang-en">Documents, images, video, and live captures received. Only
            administration can view. Assign to specialist (email) or remove.</p>
          <p class="dashboard-letters__intro lang-ar">المستندات والصور والفيديو والتصوير المباشر المستلمة. الإدارة فقط
            تطلع. تعيين للمختص (بريد) أو حذف.</p>
          <div class="dashboard-uploads-tabs">
            <button type="button" class="dashboard-upload-tab is-active" data-tab="docs"><span
                class="lang-en">Documents</span><span class="lang-ar">مستندات</span></button>
            <button type="button" class="dashboard-upload-tab" data-tab="images"><span
                class="lang-en">Images</span><span class="lang-ar">صور</span></button>
            <button type="button" class="dashboard-upload-tab" data-tab="video"><span class="lang-en">Video</span><span
                class="lang-ar">فيديو</span></button>
            <button type="button" class="dashboard-upload-tab" data-tab="live"><span class="lang-en">Live</span><span
                class="lang-ar">مباشر</span></button>
          </div>`;
}

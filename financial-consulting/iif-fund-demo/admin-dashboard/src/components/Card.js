export function Card({ title, children, className = '' } = {}) {
  return `
<div class="dashboard-card ${className}">
  ${title ? `<h2 class="dashboard-card__title">${title}</h2>` : ''}
  <div class="dashboard-card__content">
    ${children || ''}
  </div>
</div>
  `.trim();
}

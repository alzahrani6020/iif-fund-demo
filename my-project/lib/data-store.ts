// ============================================================
// lib/data-store.ts — API Client for Alzahrani Platform
// ============================================================
// All content data is now fetched from the backend API.
// This file provides the same interface as before but uses
// async fetch() calls instead of localStorage.
// ============================================================

// ==================== TYPES ====================

export interface Poem {
  _id?: string
  id?: string
  title: string
  category: string
  content: string
  excerpt?: string
  date: string
  views: number
  likes?: number
  hasAudio?: boolean
}

export interface Article {
  _id?: string
  id?: string
  title: string
  content: string
  excerpt?: string
  category?: string
  date: string
  views: number
  readTime?: string
}

export interface Proverb {
  _id?: string
  id?: string
  text: string
  meaning: string
  category?: string
  date: string
  likes?: number
}

export interface DictionaryEntry {
  _id?: string
  id?: string
  word: string
  meaning: string
  example?: string
  usage?: string
  culturalNote?: string
  letter?: string
  category?: string
  pronunciation?: string
  date: string
}

export interface Video {
  _id?: string
  id?: string
  title: string
  url?: string
  description?: string
  thumbnail?: string
  youtubeId?: string
  fileUrl?: string
  fileSize?: number
  fileType?: string
  category?: string
  date: string
  views: number
  duration?: string
  featured?: boolean
}

export interface Audio {
  _id?: string
  id?: string
  title: string
  url: string
  date: string
  views: number
  duration?: string
  durationSecs?: number
  category?: string
  description?: string
  year?: string
}

export interface Comment {
  _id?: string
  id?: string
  itemId: string
  itemType: string
  name: string
  email?: string
  content: string
  date: string
  status?: 'pending' | 'approved' | 'rejected'
}

export interface UserProfile {
  _id?: string
  id?: string
  name: string
  email: string
  password?: string
  avatar?: string
  frame?: string
  role?: 'user' | 'moderator' | 'admin'
  active?: boolean
  createdAt?: string
}

export interface HistoricalEvent {
  _id?: string
  id?: string
  title: string
  date: string
  location?: string
  sides?: string
  result?: string
  description: string
  category: string
}

export interface Category {
  _id?: string
  id?: string
  name: string
  type: 'poem' | 'article' | 'proverb' | 'dictionary' | 'video' | 'audio' | 'history'
  color?: string
  icon?: string
  createdAt?: string
}

export interface SiteConfig {
  poetName: string
  poetSubtitle: string
  logoImage?: string
  poetImage?: string
}

export interface ContentCheckResult {
  clean: boolean
  flaggedWords: string[]
}

export interface ContentData {
  poems: Poem[]
  articles: Article[]
  proverbs: Proverb[]
  dictionary: DictionaryEntry[]
  videos: Video[]
  audio: Audio[]
  comments: Comment[]
  history: HistoricalEvent[]
}

// ==================== API HELPER ====================

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const baseUrl = typeof window === 'undefined'
    ? (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
    : ''
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${path} failed: ${res.status} ${text}`)
  }
  return res.json()
}

function normalizeId<T extends { _id?: string; id?: string }>(item: T): T & { id: string } {
  return { ...item, id: item._id || item.id || '' } as T & { id: string }
}

// ==================== VIDEOS ====================

export async function getVideos(): Promise<Video[]> {
  const videos = await api<Video[]>('/api/videos/')
  return videos.map(normalizeId)
}

export async function addVideo(video: Omit<Video, '_id' | 'id' | 'date' | 'views'>): Promise<Video> {
  return api<Video>('/api/videos/', {
    method: 'POST',
    body: JSON.stringify(video),
  })
}

export async function updateVideo(id: string, updates: Partial<Video>): Promise<Video | null> {
  return api<Video>(`/api/videos/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

export async function deleteVideo(id: string): Promise<void> {
  await api(`/api/videos/${id}/`, { method: 'DELETE' })
}

// ==================== POEMS ====================

export async function getPoems(): Promise<Poem[]> {
  const poems = await api<Poem[]>('/api/poems/')
  return poems.map(normalizeId)
}

export async function addPoem(poem: Omit<Poem, '_id' | 'id' | 'date' | 'views'>): Promise<Poem> {
  return api<Poem>('/api/poems/', {
    method: 'POST',
    body: JSON.stringify(poem),
  })
}

export async function updatePoem(id: string, updates: Partial<Poem>): Promise<Poem | null> {
  return api<Poem>(`/api/poems/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

export async function deletePoem(id: string): Promise<void> {
  await api(`/api/poems/${id}/`, { method: 'DELETE' })
}

// ==================== ARTICLES ====================

export async function getArticles(): Promise<Article[]> {
  const articles = await api<Article[]>('/api/articles/')
  return articles.map(normalizeId)
}

export async function addArticle(article: Omit<Article, '_id' | 'id' | 'date' | 'views'>): Promise<Article> {
  return api<Article>('/api/articles/', {
    method: 'POST',
    body: JSON.stringify(article),
  })
}

export async function updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
  return api<Article>(`/api/articles/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

export async function deleteArticle(id: string): Promise<void> {
  await api(`/api/articles/${id}/`, { method: 'DELETE' })
}

// ==================== PROVERBS ====================

export async function getProverbs(): Promise<Proverb[]> {
  const proverbs = await api<Proverb[]>('/api/proverbs/')
  return proverbs.map(normalizeId)
}

export async function addProverb(proverb: Omit<Proverb, '_id' | 'id' | 'date'>): Promise<Proverb> {
  return api<Proverb>('/api/proverbs/', {
    method: 'POST',
    body: JSON.stringify(proverb),
  })
}

export async function updateProverb(id: string, updates: Partial<Proverb>): Promise<Proverb | null> {
  return api<Proverb>(`/api/proverbs/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

export async function deleteProverb(id: string): Promise<void> {
  await api(`/api/proverbs/${id}/`, { method: 'DELETE' })
}

// ==================== DICTIONARY ====================

export async function getDictionary(): Promise<DictionaryEntry[]> {
  const entries = await api<DictionaryEntry[]>('/api/dictionary/')
  return entries.map(normalizeId)
}

export async function addDictionaryEntry(entry: Omit<DictionaryEntry, '_id' | 'id' | 'date'>): Promise<DictionaryEntry> {
  return api<DictionaryEntry>('/api/dictionary/', {
    method: 'POST',
    body: JSON.stringify(entry),
  })
}

export async function updateDictionaryEntry(id: string, updates: Partial<DictionaryEntry>): Promise<DictionaryEntry | null> {
  return api<DictionaryEntry>(`/api/dictionary/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

export async function deleteDictionaryEntry(id: string): Promise<void> {
  await api(`/api/dictionary/${id}/`, { method: 'DELETE' })
}

// ==================== AUDIO ====================

export async function getAudio(): Promise<Audio[]> {
  const audio = await api<Audio[]>('/api/audio/')
  return audio.map(normalizeId)
}

export async function addAudio(audio: Omit<Audio, '_id' | 'id' | 'date' | 'views'>): Promise<Audio> {
  return api<Audio>('/api/audio/', {
    method: 'POST',
    body: JSON.stringify(audio),
  })
}

export async function updateAudio(id: string, updates: Partial<Audio>): Promise<Audio | null> {
  return api<Audio>(`/api/audio/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

export async function deleteAudio(id: string): Promise<void> {
  await api(`/api/audio/${id}/`, { method: 'DELETE' })
}

// ==================== HISTORY ====================

export async function getHistory(): Promise<HistoricalEvent[]> {
  const events = await api<HistoricalEvent[]>('/api/history/')
  return events.map(normalizeId)
}

export async function addHistoryEvent(event: Omit<HistoricalEvent, '_id' | 'id'>): Promise<HistoricalEvent> {
  return api<HistoricalEvent>('/api/history/', {
    method: 'POST',
    body: JSON.stringify(event),
  })
}

export async function updateHistoryEvent(id: string, updates: Partial<HistoricalEvent>): Promise<HistoricalEvent | null> {
  return api<HistoricalEvent>(`/api/history/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

export async function deleteHistoryEvent(id: string): Promise<void> {
  await api(`/api/history/${id}/`, { method: 'DELETE' })
}

// ==================== CATEGORIES ====================

export async function getCategories(): Promise<Category[]> {
  const categories = await api<Category[]>('/api/categories/')
  return categories.map(normalizeId)
}

export async function addCategory(category: Omit<Category, '_id' | 'id'>): Promise<Category> {
  return api<Category>('/api/categories/', {
    method: 'POST',
    body: JSON.stringify(category),
  })
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  return api<Category>(`/api/categories/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

export async function deleteCategory(id: string): Promise<void> {
  await api(`/api/categories/${id}/`, { method: 'DELETE' })
}

// ==================== COMMENTS ====================

export async function getComments(itemId: string, itemType: string): Promise<Comment[]> {
  const comments = await api<Comment[]>('/api/comments/')
  return comments
    .map(normalizeId)
    .filter(c => c.itemId === itemId && c.itemType === itemType && c.status === 'approved')
}

export async function addComment(comment: Omit<Comment, '_id' | 'id' | 'date' | 'status'>): Promise<Comment> {
  return api<Comment>('/api/comments/', {
    method: 'POST',
    body: JSON.stringify(comment),
  })
}

export async function deleteComment(id: string): Promise<void> {
  await api(`/api/comments/${id}/`, { method: 'DELETE' })
}

export async function getAllComments(): Promise<Comment[]> {
  const comments = await api<Comment[]>('/api/comments/')
  return comments.map(normalizeId)
}

export async function getPendingComments(): Promise<Comment[]> {
  const comments = await getAllComments()
  return comments.filter(c => c.status === 'pending')
}

export async function approveComment(id: string): Promise<void> {
  await api(`/api/comments/${id}/`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'approved' }),
  })
}

export async function rejectComment(id: string): Promise<void> {
  await api(`/api/comments/${id}/`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'rejected' }),
  })
}

// ==================== USERS ====================

export async function getAllUsers(): Promise<UserProfile[]> {
  const users = await api<UserProfile[]>('/api/users/')
  return users.map(normalizeId)
}

export async function deleteUser(id: string): Promise<void> {
  await api(`/api/users/${id}/`, { method: 'DELETE' })
}

export async function updateUserRole(id: string, role: 'user' | 'moderator' | 'admin'): Promise<void> {
  await api(`/api/users/${id}/`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  })
}

export async function toggleUserActive(id: string, active: boolean): Promise<void> {
  await api(`/api/users/${id}/`, {
    method: 'PUT',
    body: JSON.stringify({ active }),
  })
}

// Local user auth (kept in localStorage for visitors)
const USERS_KEY = 'alzahrani_users_v1'
const SESSION_KEY = 'alzahrani_user_session'

function getLocalUsers(): UserProfile[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : []
}

function saveLocalUsers(users: UserProfile[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function registerUser(name: string, email: string, password: string): UserProfile | null {
  if (typeof window === 'undefined') return null
  const users = getLocalUsers()
  if (users.find(u => u.email === email.trim().toLowerCase())) return null
  const newUser: UserProfile = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    createdAt: new Date().toISOString().slice(0, 10),
    role: 'user',
  }
  users.push(newUser)
  saveLocalUsers(users)
  localStorage.setItem(SESSION_KEY, newUser.id)
  return newUser
}

export function loginUser(email: string, password: string): UserProfile | null {
  if (typeof window === 'undefined') return null
  const users = getLocalUsers()
  const user = users.find(u => u.email === email.trim().toLowerCase() && u.password === password)
  if (user) {
    localStorage.setItem(SESSION_KEY, user.id)
    return user
  }
  return null
}

export function logoutUser() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_KEY)
}

export function getCurrentUser(): UserProfile | null {
  if (typeof window === 'undefined') return null
  const sessionId = localStorage.getItem(SESSION_KEY)
  if (!sessionId) return null
  return getLocalUsers().find(u => u.id === sessionId) || null
}

export function updateUserProfile(updates: Partial<UserProfile>): UserProfile | null {
  if (typeof window === 'undefined') return null
  const current = getCurrentUser()
  if (!current) return null
  const users = getLocalUsers()
  const idx = users.findIndex(u => u.id === current.id)
  if (idx === -1) return null
  users[idx] = { ...users[idx], ...updates }
  saveLocalUsers(users)
  return users[idx]
}

export function isUserLoggedIn(): boolean {
  return !!getCurrentUser()
}

// ==================== ADMIN AUTH ====================

export async function login(password: string): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout/', { method: 'POST' })
}

export async function isLoggedIn(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/me/')
    return res.ok
  } catch {
    return false
  }
}

export async function changeAdminPassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/auth/change-password/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    const data = await res.json()
    if (!res.ok) {
      return { success: false, message: data.error || 'Failed to change password' }
    }
    return { success: true, message: data.message || 'Password changed successfully' }
  } catch {
    return { success: false, message: 'Network error' }
  }
}

// ==================== BOOKMARKS ====================

const BOOKMARKS_KEY = 'alzahrani_bookmarks_v1'

export interface Bookmark {
  id: string
  userId: string
  itemId: string
  itemType: string
  title: string
  href: string
  date: string
}

export function getUserBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(BOOKMARKS_KEY)
  const user = getCurrentUser()
  const bookmarks = data ? JSON.parse(data) : []
  return user ? bookmarks.filter((b: Bookmark) => b.userId === user.id) : []
}

export function addBookmark(bookmark: Omit<Bookmark, 'id' | 'date'>): Bookmark {
  const user = getCurrentUser()
  if (!user) throw new Error('Not logged in')
  const bookmarks = getUserBookmarks()
  const newBookmark: Bookmark = {
    ...bookmark,
    id: crypto.randomUUID(),
    date: new Date().toISOString().slice(0, 10),
  }
  bookmarks.push(newBookmark)
  if (typeof window !== 'undefined') {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
  }
  return newBookmark
}

export function removeBookmark(itemId: string, itemType: string) {
  const bookmarks = getUserBookmarks().filter(b => !(b.itemId === itemId && b.itemType === itemType))
  if (typeof window !== 'undefined') {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
  }
}

export function isBookmarked(itemId: string, itemType: string): boolean {
  return getUserBookmarks().some(b => b.itemId === itemId && b.itemType === itemType)
}

// ==================== SITE CONFIG ====================

export async function getSiteConfig(): Promise<SiteConfig> {
  return api<SiteConfig>('/api/site-config/')
}

export async function updateSiteConfig(config: Partial<SiteConfig>): Promise<SiteConfig> {
  return api<SiteConfig>('/api/site-config/', {
    method: 'PUT',
    body: JSON.stringify(config),
  })
}

export async function resetSiteConfig(): Promise<SiteConfig> {
  return updateSiteConfig({
    poetName: 'محمد عيضة الزهراني',
    poetSubtitle: 'شاعر وباحث في التراث',
  })
}

// ==================== STATS ====================

export async function getStats() {
  const [poems, articles, proverbs, dictionary, videos, audio, comments, users, categories] = await Promise.all([
    getPoems(), getArticles(), getProverbs(), getDictionary(),
    getVideos(), getAudio(), getAllComments(), getAllUsers(), getCategories(),
  ])

  const totalViews = [...poems, ...articles, ...videos, ...audio].reduce((a, b) => a + (b.views || 0), 0)

  return {
    poems: poems.length,
    articles: articles.length,
    proverbs: proverbs.length,
    dictionary: dictionary.length,
    videos: videos.length,
    audio: audio.length,
    comments: comments.length,
    users: users.length,
    categories: categories.length,
    totalViews,
  }
}

export async function getEnhancedStats() {
  const stats = await getStats()
  const allComments = await getAllComments()
  const pendingComments = allComments.filter(c => c.status === 'pending').length

  return {
    ...stats,
    pendingComments,
    flaggedItems: 0,
  }
}

// ==================== MODERATION ====================

const BANNED_WORDS = [
  'سب', 'قذف', 'شتيمة', 'زنديق', 'كافر', 'نجس',
  'xxx', 'porn', 'sex', 'nude', 'naked', 'adult',
]

export function checkContent(text: string): ContentCheckResult {
  const flaggedWords = BANNED_WORDS.filter(word => text.toLowerCase().includes(word.toLowerCase()))
  return {
    clean: flaggedWords.length === 0,
    flaggedWords,
  }
}

export function getBannedWords(): string[] {
  return [...BANNED_WORDS]
}

export function addBannedWord(word: string) {
  if (!BANNED_WORDS.includes(word)) {
    BANNED_WORDS.push(word)
  }
}

export function removeBannedWord(word: string) {
  const idx = BANNED_WORDS.indexOf(word)
  if (idx !== -1) BANNED_WORDS.splice(idx, 1)
}

// ==================== IMAGE UTILITIES ====================

export async function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function uploadImageToR2(file: File): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('https://images.mzahrani.com', {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error('Upload failed')
  return res.json()
}

export function checkImageUrl(url: string): { status: 'safe' | 'blocked' | 'warning'; reason?: string } {
  const blockedExts = ['.exe', '.bat', '.cmd', '.sh', '.dll']
  if (blockedExts.some(ext => url.toLowerCase().endsWith(ext))) {
    return { status: 'blocked', reason: 'Executable files are not allowed' }
  }
  const warningPatterns = ['porn', 'xxx', 'adult', 'nude', 'naked', 'sex']
  if (warningPatterns.some(p => url.toLowerCase().includes(p))) {
    return { status: 'warning', reason: 'URL contains suspicious keywords' }
  }
  return { status: 'safe' }
}

// ==================== VIDEO UPLOAD ====================

export async function getPresignedVideoUrl(filename: string, contentType: string): Promise<{ url: string; publicUrl: string; key: string }> {
  return api('/api/upload/presign/', {
    method: 'POST',
    body: JSON.stringify({ filename, contentType }),
  })
}

// ==================== BACKUP / EXPORT ====================

export async function exportData(): Promise<string> {
  const [poems, articles, proverbs, dictionary, videos, audio, history, categories, comments] = await Promise.all([
    getPoems(), getArticles(), getProverbs(), getDictionary(),
    getVideos(), getAudio(), getHistory(), getCategories(), getAllComments(),
  ])
  return JSON.stringify({ poems, articles, proverbs, dictionary, videos, audio, history, categories, comments }, null, 2)
}

export async function importData(json: string): Promise<boolean> {
  try {
    const data = JSON.parse(json)
    // Note: bulk import would need dedicated API endpoints
    console.log('Import data parsed:', Object.keys(data))
    return true
  } catch {
    return false
  }
}

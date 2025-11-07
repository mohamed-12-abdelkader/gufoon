# دليل إعداد نظام الدردشة

## المتطلبات

### 1. تثبيت Socket.IO
```bash
npm install socket.io-client
```

### 2. التأكد من تشغيل Backend Server
يجب أن يكون الـ backend server يعمل على `http://localhost:8000` مع دعم:
- Socket.IO
- API endpoints للدردشة
- JWT Authentication

## الملفات المُضافة

### Contexts
- `src/contexts/ChatContext.js` - إدارة حالة الدردشة

### Components
- `src/components/chat/ChatList.jsx` - قائمة المحادثات
- `src/components/chat/ChatWindow.jsx` - نافذة الدردشة
- `src/components/chat/NewConversationModal.jsx` - نافذة محادثة جديدة
- `src/components/chat/ChatNotifications.jsx` - الإشعارات

### Pages
- `src/pages/chat/Chat.jsx` - صفحة المستخدمين
- `src/pages/chat/AdminChat.jsx` - صفحة الإدارة

## التحديثات المُطبقة

### 1. package.json
```json
{
  "dependencies": {
    "socket.io-client": "^4.7.4"
  }
}
```

### 2. App.js
```javascript
import { ChatProvider } from './contexts/ChatContext';

// تم إضافة ChatProvider حول التطبيق
<ChatProvider>
  <Navbar />
  <Router />
  <ToastContainer />
  <Footer />
</ChatProvider>
```

### 3. Router.jsx
```javascript
// تم إضافة routes جديدة
<Route path="/chat" element={<Chat />} />
<Route path="chat" element={<AdminChat />} />
```

### 4. Navbar
- تم إضافة روابط الدردشة
- تم إضافة مؤشر الاتصال
- تم إضافة نظام الإشعارات

## كيفية الاستخدام

### للمستخدمين
1. تسجيل الدخول
2. الذهاب إلى `/chat`
3. إنشاء محادثة جديدة أو اختيار محادثة موجودة
4. إرسال واستقبال الرسائل

### للإدارة
1. تسجيل الدخول كإداري
2. الذهاب إلى `/admin/chat`
3. عرض جميع المحادثات
4. إدارة المحادثات وتخصيصها

## API Endpoints المطلوبة

```
POST /api/chat/conversations
GET /api/chat/conversations
GET /api/chat/conversations/{id}/messages
POST /api/chat/messages
PATCH /api/chat/conversations/{id}/status
PATCH /api/chat/conversations/{id}/assign
GET /api/chat/stats
```

## Socket.IO Events المطلوبة

### Client → Server
- `send_message`
- `join_conversation`
- `typing`

### Server → Client
- `new_message`
- `user_message`
- `new_conversation`
- `user_typing`

## الأمان
- جميع الطلبات تتطلب JWT token
- Socket.IO يستخدم JWT للمصادقة
- المستخدمون يرون فقط محادثاتهم
- الإدارة ترى جميع المحادثات

## استكشاف الأخطاء

### مشاكل الاتصال
1. التأكد من تشغيل backend server
2. التأكد من صحة JWT token
3. فحص console للأخطاء

### مشاكل Socket.IO
1. التأكد من تثبيت socket.io-client
2. فحص network tab للاتصالات
3. التأكد من صحة URL في ChatContext

## التخصيص
- يمكن تخصيص واجهة المستخدم في المكونات
- يمكن إضافة أنواع رسائل جديدة
- يمكن تخصيص الإشعارات
- يمكن إضافة ميزات إضافية مثل الملفات المرفقة







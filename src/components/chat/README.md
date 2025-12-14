# نظام الدردشة - Chat System

## نظرة عامة
تم إنشاء نظام دردشة real-time للموقع يسمح للمستخدمين بالتواصل مع الإدارة والدعم الفني.

## الملفات المُنشأة

### Contexts
- `src/contexts/ChatContext.js` - سياق إدارة حالة الدردشة و Socket.IO

### Components
- `src/components/chat/ChatList.jsx` - قائمة المحادثات
- `src/components/chat/ChatWindow.jsx` - نافذة الدردشة الرئيسية
- `src/components/chat/NewConversationModal.jsx` - نافذة إنشاء محادثة جديدة
- `src/components/chat/ChatNotifications.jsx` - نظام الإشعارات

### Pages
- `src/pages/chat/Chat.jsx` - صفحة الدردشة للمستخدمين
- `src/pages/chat/AdminChat.jsx` - صفحة إدارة المحادثات للإدارة

## الميزات المُنفذة

### للمستخدمين
- ✅ إنشاء محادثة جديدة مع الدعم الفني
- ✅ إرسال واستقبال الرسائل في الوقت الفعلي
- ✅ رؤية حالة المحادثة (مفتوحة/مغلقة/محلولة)
- ✅ إشعارات فورية عند وصول رسائل جديدة
- ✅ مؤشر الكتابة
- ✅ واجهة مستخدم عربية

### للإدارة
- ✅ رؤية جميع المحادثات
- ✅ تخصيص المحادثات للإداريين
- ✅ إدارة حالة المحادثات
- ✅ إحصائيات المحادثات
- ✅ إشعارات فورية عند وصول رسائل جديدة من المستخدمين
- ✅ واجهة إدارية متقدمة

## التكامل مع النظام الحالي

### Router
- تم إضافة `/chat` للمستخدمين
- تم إضافة `/admin/chat` للإدارة

### Navbar
- تم إضافة روابط الدردشة
- تم إضافة مؤشر الاتصال
- تم إضافة نظام الإشعارات

### App.js
- تم إضافة `ChatProvider` للـ context

## Socket.IO Events المُنفذة

### Client Events
- `send_message` - إرسال رسالة
- `join_conversation` - الانضمام للمحادثة
- `typing` - مؤشر الكتابة

### Server Events
- `new_message` - رسالة جديدة
- `user_message` - رسالة من مستخدم (للإدارة)
- `new_conversation` - محادثة جديدة (للإدارة)
- `user_typing` - مؤشر الكتابة

## API Integration

النظام متكامل مع الـ API endpoints التالية:
- `POST /api/chat/conversations` - إنشاء محادثة
- `GET /api/chat/conversations` - الحصول على المحادثات
- `GET /api/chat/conversations/{id}/messages` - الحصول على الرسائل
- `POST /api/chat/messages` - إرسال رسالة
- `PATCH /api/chat/conversations/{id}/status` - تحديث حالة المحادثة
- `PATCH /api/chat/conversations/{id}/assign` - تخصيص المحادثة
- `GET /api/chat/stats` - إحصائيات المحادثات

## التثبيت والاستخدام

1. تثبيت Socket.IO:
```bash
npm install socket.io-client
```

2. التأكد من تشغيل الـ backend server على `http://localhost:8000`

3. الوصول للدردشة:
- المستخدمون: `/chat`
- الإدارة: `/admin/chat`

## الأمان
- جميع الطلبات تتطلب مصادقة JWT
- المستخدمون يرون فقط محادثاتهم
- الإدارة ترى جميع المحادثات
- Socket.IO يستخدم JWT للمصادقة

## التخصيص
يمكن تخصيص النظام من خلال:
- إضافة أنواع رسائل جديدة في `ChatContext.js`
- تخصيص واجهة المستخدم في المكونات
- إضافة ميزات إضافية مثل الملفات المرفقة
- تخصيص الإشعارات في `ChatNotifications.jsx`








import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaImage, FaSearch, FaArrowLeft, FaFolder } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import baseUrl from '../../api/baseUrl';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMainModal, setShowAddMainModal] = useState(false);
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cover: null,
    parentId: null
  });

  useEffect(() => {
    fetchCategories();
    fetchMainCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await baseUrl.get('/api/categories/hierarchy', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('فشل في تحميل التصنيفات');
    } finally {
      setLoading(false);
    }
  };

  const fetchMainCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await baseUrl.get('/api/categories/main', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setMainCategories(response.data);
    } catch (error) {
      console.error('Error fetching main categories:', error);
      toast.error('فشل في تحميل التصنيفات الرئيسية');
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    
    try {
      setDeleteLoading(true);
      const token = localStorage.getItem('token');
      await baseUrl.delete(`/api/categories/${selectedCategory.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success(`تم حذف التصنيف "${selectedCategory.name}" بنجاح`);
      await fetchCategories();
      setShowDeleteModal(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('فشل في حذف التصنيف');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      cover: category.cover,
      parentId: category.parentId
    });
    setShowEditModal(true);
  };

  const handleAddMain = () => {
    setFormData({
      name: '',
      description: '',
      cover: null,
      parentId: null
    });
    setSelectedCategory(null);
    setShowAddMainModal(true);
  };

  const handleAddSub = (parentCategory = null) => {
    setFormData({
      name: '',
      description: '',
      cover: null,
      parentId: parentCategory ? parentCategory.id : null
    });
    setSelectedCategory(null);
    setShowAddSubModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      if (selectedCategory) {
        await baseUrl.put(`/api/categories/${selectedCategory.id}`, formData, { headers });
        toast.success(`تم تعديل التصنيف "${formData.name}" بنجاح`);
      }
      await fetchCategories();
      setShowEditModal(false);
      setSelectedCategory(null);
      setFormData({ name: '', description: '', cover: null, parentId: null });
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('فشل في تعديل التصنيف');
    }
  };

  const handleSubmitMain = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      if (formData.cover) {
        formDataToSend.append('cover', formData.cover);
      }

      await baseUrl.post('/api/categories/main', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success(`تم إضافة التصنيف الرئيسي "${formData.name}" بنجاح`);
      await fetchCategories();
      await fetchMainCategories();
      setShowAddMainModal(false);
      setFormData({ name: '', description: '', cover: null, parentId: null });
    } catch (error) {
      console.error('Error adding main category:', error);
      toast.error('فشل في إضافة التصنيف الرئيسي');
    }
  };

  const handleSubmitSub = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('parentId', formData.parentId);
      if (formData.cover) {
        formDataToSend.append('cover', formData.cover);
      }

      await baseUrl.post('/api/categories/sub', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success(`تم إضافة التصنيف الفرعي "${formData.name}" بنجاح`);
      await fetchCategories();
      setShowAddSubModal(false);
      setFormData({ name: '', description: '', cover: null, parentId: null });
    } catch (error) {
      console.error('Error adding sub category:', error);
      toast.error('فشل في إضافة التصنيف الفرعي');
    }
  };

  const filterCategories = (cats, term) => {
    if (!term) return cats;
    return cats.filter(cat => {
      const matchesName = cat.name.toLowerCase().includes(term.toLowerCase());
      const matchesDesc = cat.description?.toLowerCase().includes(term.toLowerCase());
      const childrenMatch = cat.children ? filterCategories(cat.children, term).length > 0 : false;
      return matchesName || matchesDesc || childrenMatch;
    }).map(cat => ({
      ...cat,
      children: cat.children ? filterCategories(cat.children, term) : []
    }));
  };

  const renderCategory = (category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isMain = !category.parentId;

    return (
      <div key={category.id} className="category-item-wrapper">
        <Card className={`category-card ${isMain ? 'main-category' : 'sub-category'}`}>
          <Card.Body className="p-3">
            <div className="category-content">
              <Link 
                to={`/categories/${category.id}`} 
                className="category-link"
                onClick={(e) => {
                  // Allow admin actions to work
                  if (e.target.closest('.category-actions')) {
                    e.preventDefault();
                  }
                }}
              >
                <div className="category-info-section">
                  <div className="category-image-wrapper">
                    {category.cover ? (
                      <img
                        src={category.cover}
                        alt={category.name}
                        className="category-image"
                      />
                    ) : (
                      <div className="category-image-placeholder">
                        <FaImage className="text-muted" />
                      </div>
                    )}
                  </div>
                  
                  <div className="category-details">
                    <div className="category-header">
                      <h5 className="category-name mb-1">{category.name}</h5>
                      <Badge bg={isMain ? 'primary' : 'success'} className="category-badge">
                        {isMain ? 'رئيسي' : 'فرعي'}
                      </Badge>
                    </div>
                    {category.description && (
                      <p className="category-description mb-0">{category.description}</p>
                    )}
                    {hasChildren && (
                      <small className="text-muted">
                        {category.children.length} تصنيف فرعي
                      </small>
                    )}
                  </div>
                </div>
              </Link>

              <div className="category-actions" onClick={(e) => e.stopPropagation()}>
                {isMain && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => handleAddSub(category)}
                    className="action-btn"
                    title="إضافة تصنيف فرعي"
                  >
                    <FaPlus className="me-1" />
                    <span className="d-none d-md-inline">إضافة فرعي</span>
                  </Button>
                )}
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => handleEdit(category)}
                  className="action-btn"
                  title="تعديل"
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowDeleteModal(true);
                  }}
                  className="action-btn"
                  title="حذف"
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Render children directly without expand/collapse */}
        {hasChildren && (
          <div className="category-children mt-2">
            {category.children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredCategories = filterCategories(categories, searchTerm);

  if (loading) {
    return (
      <div className="categories-loading">
        <Spinner animation="border" variant="primary" size="lg" />
        <p className="mt-3">جاري تحميل التصنيفات...</p>
      </div>
    );
  }

  return (
    <div className="" dir="rtl">
      <Container fluid className="py-4">
        {/* Header Section */}
        <div className=" mb-4">
          <div className="header-content">
            <div>
              <h2 className="page-title mb-2">إدارة التصنيفات</h2>
              <p className="text-muted mb-0">إدارة وتنظيم تصنيفات المنتجات</p>
            </div>
            <div className="header-actions">
              <Button
                variant="primary"
                onClick={handleAddMain}
                className="action-button main-btn"
              >
                <FaPlus className="me-2" />
                تصنيف رئيسي
              </Button>
              <Button
                variant="success"
                onClick={() => handleAddSub()}
                className="action-button sub-btn"
              >
                <FaPlus className="me-2" />
                تصنيف فرعي
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-section mt-3">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="ابحث عن تصنيف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="categories-list">
          {filteredCategories.length > 0 ? (
            filteredCategories.map(category => renderCategory(category))
          ) : (
            <Card className="empty-state-card">
              <Card.Body className="text-center py-5">
                <FaFolder className="empty-icon mb-3" />
                <h5>لا توجد تصنيفات متاحة</h5>
                <p className="text-muted">ابدأ بإضافة تصنيف جديد</p>
              </Card.Body>
            </Card>
          )}
        </div>
      </Container>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="delete-modal-header">
          <Modal.Title>تأكيد الحذف</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="delete-confirmation">
            <div className="warning-icon mb-3">
              <FaTrash />
            </div>
            <p className="mb-2">هل أنت متأكد من حذف التصنيف <strong>"{selectedCategory?.name}"</strong>؟</p>
            {selectedCategory?.children && selectedCategory.children.length > 0 && (
              <Alert variant="warning" className="mt-3">
                <strong>تحذير:</strong> هذا التصنيف يحتوي على {selectedCategory.children.length} تصنيف فرعي سيتم حذفها أيضاً
              </Alert>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            إلغاء
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                جاري الحذف...
              </>
            ) : (
              'حذف'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
        <Modal.Header closeButton className="edit-modal-header">
          <Modal.Title>
            <FaEdit className="me-2" />
            تعديل التصنيف
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">اسم التصنيف</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="form-control-custom"
                placeholder="أدخل اسم التصنيف"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">الوصف</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-control-custom"
                placeholder="أدخل وصف التصنيف (اختياري)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">رابط الصورة</Form.Label>
              <Form.Control
                type="url"
                value={formData.cover}
                onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="form-control-custom"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">التصنيف الأب (اختياري)</Form.Label>
              <Form.Select
                value={formData.parentId || ''}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                className="form-control-custom"
              >
                <option value="">تصنيف رئيسي</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              إلغاء
            </Button>
            <Button variant="primary" type="submit" className="px-4">
              حفظ التغييرات
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Add Main Category Modal */}
      <Modal show={showAddMainModal} onHide={() => setShowAddMainModal(false)} size="lg" centered>
        <Modal.Header closeButton className="add-modal-header">
          <Modal.Title>
            <FaPlus className="me-2" />
            إضافة تصنيف رئيسي
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitMain}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">اسم التصنيف</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="form-control-custom"
                placeholder="أدخل اسم التصنيف الرئيسي"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">الوصف</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-control-custom"
                placeholder="أدخل وصف التصنيف (اختياري)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">صورة التصنيف</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, cover: e.target.files[0] })}
                className="form-control-custom"
              />
              <Form.Text className="text-muted">اختر صورة للتصنيف (اختياري)</Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddMainModal(false)}>
              إلغاء
            </Button>
            <Button variant="primary" type="submit" className="px-4">
              إضافة التصنيف
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Add Sub Category Modal */}
      <Modal show={showAddSubModal} onHide={() => setShowAddSubModal(false)} size="lg" centered>
        <Modal.Header closeButton className="add-modal-header">
          <Modal.Title>
            <FaPlus className="me-2" />
            إضافة تصنيف فرعي
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitSub}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">التصنيف الرئيسي</Form.Label>
              <Form.Select
                value={formData.parentId || ''}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                required
                className="form-control-custom"
              >
                <option value="">اختر التصنيف الرئيسي</option>
                {mainCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">اسم التصنيف الفرعي</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="form-control-custom"
                placeholder="أدخل اسم التصنيف الفرعي"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">الوصف</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-control-custom"
                placeholder="أدخل وصف التصنيف (اختياري)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">صورة التصنيف</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, cover: e.target.files[0] })}
                className="form-control-custom"
              />
              <Form.Text className="text-muted">اختر صورة للتصنيف (اختياري)</Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddSubModal(false)}>
              إلغاء
            </Button>
            <Button variant="success" type="submit" className="px-4">
              إضافة التصنيف
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <style>{`
        .categories-admin-page {
          background: #f8f9fa;
          min-height: 100vh;
          padding: 2rem 0;
        }

        .categories-loading {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          color: #0078FF;
        }

        .categories-header {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .action-button {
          padding: 0.6rem 1.25rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .action-button:hover {
          transform: translateY(-2px);
        }

        .main-btn {
          background: #0078FF;
          border: none;
        }

        .sub-btn {
          background: #28a745;
          border: none;
        }

        .search-section {
          margin-top: 1.5rem;
        }

        .search-input-wrapper {
          position: relative;
          max-width: 500px;
        }

        .search-icon {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          z-index: 10;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .search-input:focus {
          outline: none;
          border-color: #0078FF;
          background: white;
          box-shadow: 0 0 0 3px rgba(0, 120, 255, 0.1);
        }

        .categories-list {
          margin-top: 2rem;
        }

        .category-item-wrapper {
          margin-bottom: 1rem;
        }

        .category-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .category-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .main-category {
          background: white;
          border-right: 4px solid #0078FF;
        }

        .sub-category {
          background: #f8f9fa;
          border-right: 4px solid #28a745;
          margin-right: 2rem;
        }

        .category-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .category-link {
          text-decoration: none;
          color: inherit;
          flex: 1;
          min-width: 250px;
        }

        .category-link:hover {
          text-decoration: none;
          color: inherit;
        }

        .category-info-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
        }

        .category-info-section:hover {
          opacity: 0.8;
        }

        .category-image-wrapper {
          width: 70px;
          height: 70px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .category-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
          font-size: 1.5rem;
        }

        .category-details {
          flex: 1;
          min-width: 200px;
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .category-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
        }

        .category-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
        }

        .category-description {
          color: #6c757d;
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }

        .category-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          border-width: 2px;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .category-children {
          padding-right: 1.5rem;
          margin-top: 0.5rem;
        }

        .empty-state-card {
          border: none;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          background: white;
        }

        .empty-icon {
          font-size: 4rem;
          color: #dee2e6;
        }

        /* Modal Styles */
        .delete-modal-header,
        .edit-modal-header,
        .add-modal-header {
          background: linear-gradient(135deg, #0078FF 0%, #0056b3 100%);
          color: white;
          border-bottom: none;
        }

        .delete-modal-header .btn-close,
        .edit-modal-header .btn-close,
        .add-modal-header .btn-close {
          filter: brightness(0) invert(1);
        }

        .delete-confirmation {
          text-align: center;
        }

        .warning-icon {
          font-size: 3rem;
          color: #dc3545;
        }

        .form-label-custom {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .form-control-custom {
          border: 2px solid #e9ecef;
          border-radius: 8px;
          padding: 0.75rem;
          transition: all 0.3s ease;
        }

        .form-control-custom:focus {
          border-color: #0078FF;
          box-shadow: 0 0 0 3px rgba(0, 120, 255, 0.1);
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .categories-admin-page {
            padding: 1rem 0;
          }

          .categories-header {
            padding: 1.5rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
          }

          .action-button {
            flex: 1;
            min-width: 150px;
          }

          .category-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .category-info-section {
            width: 100%;
          }

          .category-actions {
            width: 100%;
            justify-content: flex-end;
          }

          .action-btn {
            flex: 1;
          }

          .category-item-wrapper {
            margin-left: 0 !important;
          }

          .category-children {
            padding-right: 0.5rem;
          }
        }

        @media (max-width: 576px) {
          .category-image-wrapper {
            width: 60px;
            height: 60px;
          }

          .category-name {
            font-size: 1.1rem;
          }

          .search-input-wrapper {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Categories;

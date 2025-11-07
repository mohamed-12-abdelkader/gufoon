import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Modal, Form, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
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
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [mainCategories, setMainCategories] = useState([]);

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
      await fetchCategories(); // Refresh the list
      setShowDeleteModal(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error deleting category:', error);
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

  const handleAddSub = () => {
    setFormData({
      name: '',
      description: '',
      cover: null,
      parentId: null
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
        // Edit existing category
        await baseUrl.put(`/api/categories/${selectedCategory.id}`, formData, { headers });
      }
      await fetchCategories();
      setShowEditModal(false);
      setSelectedCategory(null);
      setFormData({ name: '', description: '', cover: null, parentId: null });
    } catch (error) {
      console.error('Error saving category:', error);
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
      
      await fetchCategories();
      await fetchMainCategories();
      setShowAddMainModal(false);
      setFormData({ name: '', description: '', cover: null, parentId: null });
    } catch (error) {
      console.error('Error adding main category:', error);
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
      
      await fetchCategories();
      setShowAddSubModal(false);
      setFormData({ name: '', description: '', cover: null, parentId: null });
    } catch (error) {
      console.error('Error adding sub category:', error);
    }
  };

  const toggleExpanded = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderCategory = (category, level = 0) => {
    const isExpanded = expandedCategories.has(category.id);
    const hasChildren = category.children && category.children.length > 0;

    return (
      <div key={category.id} className="mb-3">
        <Card className={`shadow-sm ${level > 0 ? 'ms-4' : ''}`}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                {hasChildren && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => toggleExpanded(category.id)}
                    className="p-0 me-2"
                  >
                    {isExpanded ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                )}
                
                <div className="d-flex align-items-center">
                  {category.cover && (
                    <img
                      src={category.cover}
                      alt={category.name}
                      className="rounded me-3"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  )}
                  <div>
                    <h6 className="mb-1">{category.name}</h6>
                    <p className="text-muted small mb-0">{category.description}</p>
                    <small className="text-muted">
                      {category.parentId ? 'تصنيف فرعي' : 'تصنيف رئيسي'}
                    </small>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleAddSub}
                  title="إضافة تصنيف فرعي"
                >
                  <FaPlus />
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => handleEdit(category)}
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
                  title="حذف"
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Render children if expanded */}
        {isExpanded && hasChildren && (
          <div className="mt-2">
            {category.children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>إدارة التصنيفات</h2>
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            onClick={handleAddMain}
            className="d-flex align-items-center gap-2"
          >
            <FaPlus />
            إضافة تصنيف رئيسي
          </Button>
          <Button
            variant="success"
            onClick={handleAddSub}
            className="d-flex align-items-center gap-2"
          >
            <FaPlus />
            إضافة تصنيف فرعي
          </Button>
        </div>
      </div>

      <Row>
        <Col>
          {categories.length > 0 ? (
            categories.map(category => renderCategory(category))
          ) : (
            <Alert variant="info">
              لا توجد تصنيفات متاحة
            </Alert>
          )}
        </Col>
      </Row>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>تأكيد الحذف</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          هل أنت متأكد من حذف التصنيف "{selectedCategory?.name}"؟
          {selectedCategory?.children && selectedCategory.children.length > 0 && (
            <Alert variant="warning" className="mt-2">
              تحذير: هذا التصنيف يحتوي على تصنيفات فرعية سيتم حذفها أيضاً
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            إلغاء
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? <Spinner size="sm" /> : 'حذف'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>تعديل التصنيف</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>اسم التصنيف</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>الوصف</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>رابط الصورة</Form.Label>
              <Form.Control
                type="url"
                value={formData.cover}
                onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>التصنيف الأب (اختياري)</Form.Label>
              <Form.Select
                value={formData.parentId || ''}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
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
            <Button variant="primary" type="submit">
              حفظ التغييرات
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Add Main Category Modal */}
      <Modal show={showAddMainModal} onHide={() => setShowAddMainModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>إضافة تصنيف رئيسي</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitMain}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>اسم التصنيف</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>الوصف</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>صورة التصنيف</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, cover: e.target.files[0] })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddMainModal(false)}>
              إلغاء
            </Button>
            <Button variant="primary" type="submit">
              إضافة التصنيف الرئيسي
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Add Sub Category Modal */}
      <Modal show={showAddSubModal} onHide={() => setShowAddSubModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>إضافة تصنيف فرعي</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitSub}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>التصنيف الرئيسي</Form.Label>
              <Form.Select
                value={formData.parentId || ''}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                required
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
              <Form.Label>اسم التصنيف الفرعي</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>الوصف</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>صورة التصنيف</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, cover: e.target.files[0] })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddSubModal(false)}>
              إلغاء
            </Button>
            <Button variant="success" type="submit">
              إضافة التصنيف الفرعي
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Categories;
import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Image,
  Select,
  Input,
  Card,
  Row,
  Col,
  Statistic,
  Avatar,
  Tooltip,
  Popconfirm,
  message,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  EyeOutlined,
  DeleteOutlined,
  PictureOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import {
  issueReportsApi,
  IssueReport,
  IssueCategory,
  IssueStatus,
  IssuePriority,
} from '@/api/issueReports.api';
import { PageTitle } from '@/components/common/PageTitle/PageTitle';

const { Search } = Input;
const { Option } = Select;

export const IssueReportsPage: React.FC = () => {
  const [issueReports, setIssueReports] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIssue, setSelectedIssue] = useState<IssueReport | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const loadIssueReports = async () => {
    try {
      setLoading(true);
      const response = await issueReportsApi.getAllIssueReports(
        currentPage,
        pageSize,
      );
      // API response is wrapped in a data object
      setIssueReports(response.data.issueReports);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error loading issue reports:', error);
      message.error('Failed to load issue reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssueReports();
  }, [currentPage, pageSize]);

  const handleStatusChange = async (
    issueId: number,
    newStatus: IssueStatus,
  ) => {
    try {
      await issueReportsApi.updateIssueReport(issueId, { status: newStatus });
      message.success('Status updated successfully');
      loadIssueReports();
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Failed to update status');
    }
  };

  const handleDelete = async (issueId: number) => {
    try {
      await issueReportsApi.deleteIssueReport(issueId);
      message.success('Issue report deleted successfully');
      loadIssueReports();
    } catch (error) {
      console.error('Error deleting issue report:', error);
      message.error('Failed to delete issue report');
    }
  };

  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.OPEN:
        return 'red';
      case IssueStatus.IN_PROGRESS:
        return 'orange';
      case IssueStatus.RESOLVED:
        return 'green';
      case IssueStatus.CLOSED:
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: IssuePriority) => {
    switch (priority) {
      case IssuePriority.LOW:
        return 'green';
      case IssuePriority.MEDIUM:
        return 'blue';
      case IssuePriority.HIGH:
        return 'orange';
      case IssuePriority.URGENT:
        return 'red';
      default:
        return 'default';
    }
  };

  const getCategoryIcon = (category: IssueCategory) => {
    switch (category) {
      case IssueCategory.BUG:
        return '🐛';
      case IssueCategory.TRANSACTION:
        return '💳';
      case IssueCategory.UI_UX:
        return '🎨';
      case IssueCategory.FEATURE_REQUEST:
        return '✨';
      case IssueCategory.ACCOUNT:
        return '👤';
      case IssueCategory.OTHER:
        return '❓';
      default:
        return '❓';
    }
  };

  const columns: ColumnsType<IssueReport> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'User',
      key: 'user',
      width: 150,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar size="small" src={record.userImageUrl} />
          <div>
            <div style={{ fontWeight: 500 }}>
              {record.userFirstName} {record.userLastName}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.userId}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      filters: issueReportsApi.getCategoryOptions().map((option) => ({
        text: option.label,
        value: option.value,
      })),
      render: (category: IssueCategory) => (
        <Tag>
          {getCategoryIcon(category)} {category.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      filters: issueReportsApi.getPriorityOptions().map((option) => ({
        text: option.label,
        value: option.value,
      })),
      render: (priority: IssuePriority) => (
        <Tag color={getPriorityColor(priority)}>{priority.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      filters: issueReportsApi.getStatusOptions().map((option) => ({
        text: option.label,
        value: option.value,
      })),
      render: (status: IssueStatus, record) => (
        <Select
          size="small"
          value={status}
          onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
          style={{ width: '100%' }}
        >
          {issueReportsApi.getStatusOptions().map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Images',
      key: 'images',
      width: 80,
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          {record.imageUrls && record.imageUrls.length > 0 ? (
            <Tooltip title={`${record.imageUrls.length} image(s)`}>
              <PictureOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
              <span style={{ marginLeft: '4px', fontSize: '12px' }}>
                {record.imageUrls.length}
              </span>
            </Tooltip>
          ) : (
            <span style={{ color: '#ccc' }}>-</span>
          )}
        </div>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setSelectedIssue(record);
              setDetailModalVisible(true);
            }}
          />
          <Popconfirm
            title="Are you sure you want to delete this issue report?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredIssueReports = (issueReports || []).filter((report) => {
    const matchesSearch =
      searchTerm === '' ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${report.userFirstName} ${report.userLastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '' || report.status === statusFilter;
    const matchesCategory =
      categoryFilter === '' || report.category === categoryFilter;
    const matchesPriority =
      priorityFilter === '' || report.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const getStatusCounts = () => {
    const counts = {
      [IssueStatus.OPEN]: 0,
      [IssueStatus.IN_PROGRESS]: 0,
      [IssueStatus.RESOLVED]: 0,
      [IssueStatus.CLOSED]: 0,
    };

    (issueReports || []).forEach((report) => {
      counts[report.status]++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div style={{ padding: '24px' }}>
      <PageTitle>Issue Reports Management</PageTitle>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Open Issues"
              value={statusCounts[IssueStatus.OPEN]}
              valueStyle={{ color: '#cf1322' }}
              prefix="🔴"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="In Progress"
              value={statusCounts[IssueStatus.IN_PROGRESS]}
              valueStyle={{ color: '#fa8c16' }}
              prefix="🟡"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Resolved"
              value={statusCounts[IssueStatus.RESOLVED]}
              valueStyle={{ color: '#52c41a' }}
              prefix="🟢"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Closed"
              value={statusCounts[IssueStatus.CLOSED]}
              valueStyle={{ color: '#8c8c8c' }}
              prefix="⚫"
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Search
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              allowClear
            >
              {issueReportsApi.getStatusOptions().map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: '100%' }}
              allowClear
            >
              {issueReportsApi.getCategoryOptions().map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Priority"
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{ width: '100%' }}
              allowClear
            >
              {issueReportsApi.getPriorityOptions().map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Button
              icon={<FilterOutlined />}
              onClick={() => {
                setStatusFilter('');
                setCategoryFilter('');
                setPriorityFilter('');
                setSearchTerm('');
              }}
            >
              Clear Filters
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Issue Reports Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredIssueReports}
          loading={loading}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            },
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} issue reports`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={`Issue Report #${selectedIssue?.id}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedIssue && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <strong>User:</strong> {selectedIssue.userFirstName}{' '}
              {selectedIssue.userLastName} ({selectedIssue.userId})
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Title:</strong> {selectedIssue.title}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Category:</strong>{' '}
              {getCategoryIcon(selectedIssue.category)}{' '}
              {selectedIssue.category.replace('_', ' ').toUpperCase()}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Priority:</strong>{' '}
              <Tag color={getPriorityColor(selectedIssue.priority)}>
                {selectedIssue.priority.toUpperCase()}
              </Tag>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Status:</strong>{' '}
              <Tag color={getStatusColor(selectedIssue.status)}>
                {selectedIssue.status.replace('_', ' ').toUpperCase()}
              </Tag>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Description:</strong>
              <div
                style={{
                  marginTop: '8px',
                  padding: '12px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedIssue.description,
                  }}
                />
              </div>
            </div>
            {selectedIssue.imageUrls && selectedIssue.imageUrls.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <strong>Evidence Images:</strong>
                <div style={{ marginTop: '8px' }}>
                  <Image.PreviewGroup>
                    {selectedIssue.imageUrls.map((url, index) => (
                      <Image
                        key={index}
                        src={url}
                        alt={`Evidence ${index + 1}`}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          margin: '4px',
                        }}
                      />
                    ))}
                  </Image.PreviewGroup>
                </div>
              </div>
            )}
            <div style={{ marginBottom: '16px' }}>
              <strong>Created:</strong>{' '}
              {new Date(selectedIssue.createdAt).toLocaleString()}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Updated:</strong>{' '}
              {new Date(selectedIssue.updatedAt).toLocaleString()}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default IssueReportsPage;

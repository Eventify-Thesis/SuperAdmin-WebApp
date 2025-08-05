import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      message.error(t('issueReports.messages.loadFailed'));
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
      message.success(t('issueReports.messages.statusUpdated'));
      loadIssueReports();
    } catch (error) {
      console.error('Error updating status:', error);
      message.error(t('issueReports.messages.statusUpdateFailed'));
    }
  };

  const handleDelete = async (issueId: number) => {
    try {
      await issueReportsApi.deleteIssueReport(issueId);
      message.success(t('issueReports.messages.deleted'));
      loadIssueReports();
    } catch (error) {
      console.error('Error deleting issue report:', error);
      message.error(t('issueReports.messages.deleteFailed'));
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
      title: t('issueReports.table.id'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t('issueReports.table.user'),
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
      title: t('issueReports.table.title'),
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: t('issueReports.table.category'),
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
      title: t('issueReports.table.priority'),
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
      title: t('issueReports.table.status'),
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
      title: t('issueReports.table.images'),
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
      title: t('issueReports.table.created'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: t('issueReports.table.actions'),
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
            title={t('issueReports.modals.deleteConfirm.content')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('issueReports.modals.deleteConfirm.okText')}
            cancelText={t('issueReports.modals.deleteConfirm.cancelText')}
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
      <PageTitle>{t('issueReports.title')}</PageTitle>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('issueReports.statistics.openIssues')}
              value={statusCounts[IssueStatus.OPEN]}
              valueStyle={{ color: '#cf1322' }}
              prefix="🔴"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('issueReports.statistics.inProgress')}
              value={statusCounts[IssueStatus.IN_PROGRESS]}
              valueStyle={{ color: '#fa8c16' }}
              prefix="🟡"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('issueReports.statistics.resolved')}
              value={statusCounts[IssueStatus.RESOLVED]}
              valueStyle={{ color: '#52c41a' }}
              prefix="🟢"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('issueReports.statistics.closed')}
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
              placeholder={t('issueReports.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder={t('issueReports.search.filters.status')}
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
              placeholder={t('issueReports.search.filters.category')}
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
              placeholder={t('issueReports.search.filters.priority')}
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
              {t('issueReports.search.filters.clearFilters')}
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
            showTotal: (total, [from, to]) =>
              t('issueReports.pagination.total', {
                from,
                to,
                total,
              }),
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={`${t('issueReports.title')} #${selectedIssue?.id}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedIssue && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <strong>{t('issueReports.modals.details.user')}:</strong> {selectedIssue.userFirstName}{' '}
              {selectedIssue.userLastName} ({selectedIssue.userId})
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>{t('issueReports.modals.details.title')}:</strong> {selectedIssue.title}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>{t('issueReports.modals.details.category')}:</strong>{' '}
              {getCategoryIcon(selectedIssue.category)}{' '}
              {selectedIssue.category.replace('_', ' ').toUpperCase()}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>{t('issueReports.modals.details.priority')}:</strong>{' '}
              <Tag color={getPriorityColor(selectedIssue.priority)}>
                {selectedIssue.priority.toUpperCase()}
              </Tag>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>{t('issueReports.modals.details.status')}:</strong>{' '}
              <Tag color={getStatusColor(selectedIssue.status)}>
                {selectedIssue.status.replace('_', ' ').toUpperCase()}
              </Tag>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>{t('issueReports.modals.details.description')}:</strong>
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
                <strong>{t('issueReports.modals.details.evidenceImages')}:</strong>
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
              <strong>{t('issueReports.modals.details.created')}:</strong>{' '}
              {new Date(selectedIssue.createdAt).toLocaleString()}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>{t('issueReports.modals.details.updated')}:</strong>{' '}
              {new Date(selectedIssue.updatedAt).toLocaleString()}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default IssueReportsPage;

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Card, Typography, Alert, Collapse, Space } from 'antd';
import { ReloadOutlined, BugOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Alert
                message="Application Error"
                description="Something went wrong in the application. Please try refreshing the page or contact support if the problem persists."
                type="error"
                showIcon
                icon={<BugOutlined />}
              />

              <Space>
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={this.handleReload}
                >
                  Reload Page
                </Button>
                <Button onClick={this.handleReset}>Try Again</Button>
              </Space>

              {process.env.NODE_ENV === 'development' && (
                <Collapse>
                  <Panel header="Error Details (Development Mode)" key="1">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {this.state.error && (
                        <div>
                          <Title level={5}>Error Message</Title>
                          <Paragraph>
                            <Text code copyable>
                              {this.state.error.message}
                            </Text>
                          </Paragraph>
                        </div>
                      )}

                      {this.state.error?.stack && (
                        <div>
                          <Title level={5}>Stack Trace</Title>
                          <Paragraph>
                            <Text
                              code
                              copyable
                              style={{ whiteSpace: 'pre-wrap' }}
                            >
                              {this.state.error.stack}
                            </Text>
                          </Paragraph>
                        </div>
                      )}

                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <Title level={5}>Component Stack</Title>
                          <Paragraph>
                            <Text
                              code
                              copyable
                              style={{ whiteSpace: 'pre-wrap' }}
                            >
                              {this.state.errorInfo.componentStack}
                            </Text>
                          </Paragraph>
                        </div>
                      )}
                    </Space>
                  </Panel>
                </Collapse>
              )}
            </Space>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

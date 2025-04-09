import React from 'react';
import { Modal, Row, Col, Typography, Image, Divider, Card } from 'antd';
import { AgeRestriction } from '@/constants/enums/event';
import { BusinessType } from '@/constants/enums/event';
import { BASE_COLORS } from '@/styles/themes/constants';

const { Text, Title } = Typography;

export const EventDetailsModal = ({ visible, eventData, onClose }) => {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      style={{ top: 20 }}
      bodyStyle={{ backgroundColor: '#1e1e2f', borderRadius: 12, padding: 24 }}
      className="custom-dark-modal"
    >
      <Title level={3} style={{ color: 'white', textAlign: 'center', marginBottom: 24 }}>
        🎉 Event Details
      </Title>

      <Card title="🎯 Basic Info" style={sectionCardStyle}>
        <Row gutter={16} justify="center" align="middle">
          {eventData.eventLogoUrl && (
            <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
              <div style={imageFrameStyle}>
                <Image
                  src={eventData.eventLogoUrl}
                  alt="Event Logo"
                  height={100}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                Event Logo
              </Text>
            </Col>
          )}
          {eventData.eventBannerUrl && (
            <Col xs={24} sm={16} style={{ textAlign: 'center' }}>
              <div style={imageFrameStyle}>
                <Image
                  src={eventData.eventBannerUrl}
                  alt="Event Banner"
                  height={100}
                  style={{ objectFit: 'cover', width: '100%' }}
                />
              </div>
              <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                Event Banner
              </Text>
            </Col>
          )}
        </Row>
        <InfoRow label="Event Name" value={eventData.eventName} />
        <InfoRow label="Event Type" value={eventData.eventType} />
        <InfoRow label="Venue Name" value={eventData.venueName} />
        <InfoRow label="Categories" value={Array.isArray(eventData.categories) ? eventData.categories.join(', ') : 'N/A'} />
        <InfoRow label="Description" value={eventData.event?.eventDescription || 'N/A'} />
        <InfoRow
          label="Location"
          value={`${eventData.street}, Ward ${eventData.wardId}, District ${eventData.districtId}, City ${eventData.cityId}`}
        />
      </Card>

      <Card title="👤 Organizer Info" style={sectionCardStyle}>
        <Row justify="center" style={{ marginBottom: 16 }}>
          {eventData.orgLogoUrl && (
            <Col style={{ textAlign: 'center' }}>
              <div style={imageFrameStyle}>
                <Image src={eventData.orgLogoUrl} width={80} />
              </div>
              <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                Organizer Logo
              </Text>
            </Col>
          )}
        </Row>
        <InfoRow label="Organizer Name" value={eventData.orgName} />
        <InfoRow label="Description" value={eventData.orgDescription} />
      </Card>

      {eventData.shows?.map((show, index) => {
        const ticketDataKey = index.toString();
        const showTicketTypes = eventData[ticketDataKey]?.ticketTypes || [];

        return (
          <Card key={index} title={`🎬 Show ${index + 1}`} style={sectionCardStyle}>
            <InfoRow label="Start Time" value={new Date(show.startTime).toLocaleString()} />
            <InfoRow label="End Time" value={new Date(show.endTime).toLocaleString()} />

            {showTicketTypes.map((ticket, idx) => (
              <Card
                key={idx}
                type="inner"
                title={`🎟 Ticket: ${ticket.name}`}
                style={{ marginTop: 16, backgroundColor: '#fafafa', borderRadius: 12 }}
              >
                <InfoRow label="Price" value={ticket.isFree ? 'Free' : ticket.price} />
                <InfoRow label="Free" value={ticket.isFree ? 'Yes' : 'No'} />
                <InfoRow label="Quantity" value={ticket.quantity} />
                <InfoRow label="Min Tickets" value={ticket.minTicketPurchase} />
                <InfoRow label="Max Tickets" value={ticket.maxTicketPurchase} />
                <InfoRow label="Start" value={new Date(ticket.startTime).toLocaleString()} />
                <InfoRow label="End" value={new Date(ticket.endTime).toLocaleString()} />
                <InfoRow label="Description" value={ticket.description} />
                {ticket.imageUrl && (
                  <Row justify="center" style={{ marginTop: 12 }}>
                    <Col style={{ textAlign: 'center' }}>
                      <div style={imageFrameStyle}>
                        <Image src={ticket.imageUrl} width={150} />
                      </div>
                      <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                        Ticket Image
                      </Text>
                    </Col>
                  </Row>
                )}
              </Card>
            ))}
          </Card>
        );
      })}

      <Card title="⚙️ Event Settings" style={sectionCardStyle}>
        <InfoRow
          label="Event URL"
          value={eventData.setting?.url ? `${window.location.origin}/events/${eventData.setting.url}` : 'N/A'}
        />
        <InfoRow label="Max Attendees" value={eventData.setting?.maximumAttendees} />
        <InfoRow label="Age Restriction" value={AgeRestriction[eventData.setting?.ageRestriction] || 'N/A'} />
        <InfoRow label="Message to Attendees" value={eventData.setting?.messageAttendees} />
        <InfoRow label="Private" value={eventData.setting?.isPrivate ? 'Yes' : 'No'} />
        <InfoRow label="Refundable" value={eventData.setting?.isRefundable ? 'Yes' : 'No'} />
      </Card>

      <Card title="💳 Payment Info" style={sectionCardStyle}>
        <InfoRow label="Bank Account" value={eventData.paymentInfo?.bankAccount} />
        <InfoRow label="Account Name" value={eventData.paymentInfo?.bankAccountName} />
        <InfoRow label="Account Number" value={eventData.paymentInfo?.bankAccountNumber} />
        <InfoRow label="Bank Office" value={eventData.paymentInfo?.bankOffice} />
        <InfoRow label="Business Type" value={BusinessType[eventData.paymentInfo?.businessType] || 'N/A'} />
        <InfoRow label="Company Name" value={eventData.paymentInfo?.companyName} />
        <InfoRow label="Company Address" value={eventData.paymentInfo?.companyAddress} />
        <InfoRow label="Tax Number" value={eventData.paymentInfo?.companyTaxNumber || 'N/A'} />
      </Card>
    </Modal>
  );
};

// Reusable row component
const InfoRow = ({ label, value }) => (
  <Row justify="space-between" style={{ marginBottom: 8 }}>
    <Text strong>{label}:</Text>
    <Text>{value}</Text>
  </Row>
);

// Card style
const sectionCardStyle = {
  marginBottom: 24,
  borderRadius: 16,
  background: '#fff',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};
const imageFrameStyle = {
  borderRadius: 12,
  padding: 8,
  backgroundColor: '#f5f5f5',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
};

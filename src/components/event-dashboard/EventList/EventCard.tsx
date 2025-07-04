import { useState } from 'react';
import styled from 'styled-components';
import { EventCardActions } from './EventCardActions';
import { EventStatus } from '@/constants/enums/event';
import { Icon } from '@iconify/react/dist/iconify.js';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useLanguage } from '@/hooks/useLanguage';
import { EventDetailsModal } from './EventDetailsModal';
import { useUpdateEventStatus } from '@/mutations/useEventMutations';
import { useDeleteEvent } from '@/mutations/useDeleteEvent';
import { useGetEventDetail } from '@/queries/useGetEventDetail';
import { useListShows } from '@/queries/useShowQueries';
import { Button, message, Popconfirm } from 'antd';

interface EventCardProps {
  id: string;
  addressFull: string;
  eventBannerUrl: string;
  eventName: string;
  url: string;
  startTime: Date;
  endTime: string;
  status: EventStatus;
  venueName: string;
  role: string;
  refetchEvents: () => void;
}

export const EventCard = ({
  id,
  addressFull,
  eventBannerUrl,
  eventName,
  url,
  startTime,
  status,
  venueName,
  refetchEvents
}: Omit<EventCardProps, 'endTime' | 'role'>) => {
  const { language } = useLanguage();
  const locale = language === 'en' ? 'en' : 'vi';

  const updateStatusMutation = useUpdateEventStatus();
  const [modalVisible, setModalVisible] = useState(false);
  
  const { data: eventDetail } = useGetEventDetail(id);
  const { data: showsData } = useListShows(id);
  
  const deleteEventMutation = useDeleteEvent();
  
  const handleDelete = async () => {
    try {
      await deleteEventMutation.mutateAsync(id);
      refetchEvents();
    } catch (error) {
      // Error is already handled in the mutation's onError
      console.error('Error in handleDelete:', error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      if (id) {
        await updateStatusMutation.mutateAsync({
          eventId: id,
          statusData: newStatus,
          currentStatus: status
        });
        message.success(`Event status updated to ${newStatus}`);
        refetchEvents?.();
      }
    } catch (error) {
      console.error('Error updating event status:', error);
      message.error('Failed to update event status');
    }
  };

  console.log(eventDetail);
  // Toggle the visibility of the modal
  const showModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const eventData = {
    eventName,
    url,
    ...eventDetail,      // Spread the event details fetched from useGetEventDetail
    ...showsData,        // Spread the shows data
  };

  return (
    <CardContainer>
      <CardContent>
        <EventImage src={eventBannerUrl} alt={eventName} />
        <EventDetails>
          <EventTitle onClick={showModal}>
            {eventName}
          </EventTitle>
          <EventInfo>
            <DateInfo>
              <Icon icon="mdi:calendar" width="24" height="24" color="white" />
              <DateTime>
                {startTime
                  ? dayjs(startTime).locale(locale).format('LLLL')
                  : 'Null'}
              </DateTime>
            </DateInfo>
            {addressFull && (
              <LocationInfo>
                <Icon
                  icon="mdi:location"
                  width="24"
                  height="24"
                  color="white"
                />
                <LocationDetails>
                  <VenueName>{venueName}</VenueName>
                  <LocationText>{addressFull}</LocationText>
                </LocationDetails>
              </LocationInfo>
            )}
          </EventInfo>
        </EventDetails>
      </CardContent>
      <ActionsContainer>
        <EventCardActions
          id={id}
          eventStatus={status}
          onApprove={() => {
            updateStatusMutation.mutate(
              {
                eventId: id,
                statusData: EventStatus.PUBLISHED,
                currentStatus: status,
              },
              {
                onSuccess: () => {
                  refetchEvents();
                },
              },
            );
          }}
          onDecline={(eventId: string) => {
            updateStatusMutation.mutate(
              {
                eventId,
                statusData: EventStatus.CANCELLED,
                currentStatus: status,
              },
              {
                onSuccess: () => {
                  refetchEvents();
                },
              },
            );
          }}
        />
        <DeleteButtonContainer>
          <Popconfirm
            title="Are you sure you want to delete this event?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button 
              type="text" 
              danger 
              icon={<Icon icon="mdi:trash-can-outline" width={20} height={20} />} 
              loading={deleteEventMutation.isLoading}
            />
          </Popconfirm>
        </DeleteButtonContainer>
      </ActionsContainer>
      
      {/* Pass the combined event data to the modal */}
      <EventDetailsModal
        visible={modalVisible}
        eventData={eventData}
        onClose={closeModal}
      />
    </CardContainer>
  );
};

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #515158;
`;

const DeleteButtonContainer = styled.div`
  margin-left: auto;
`;

const CardContainer = styled.article`
  border-radius: 12px;
  border: 1px solid #515158;
  background-color: #515158;
  width: 100%;
  padding: 1px;
  overflow: hidden;
  margin-bottom: 16px;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const CardContent = styled.div`
  align-items: start;
  background-color: #31353e;
  display: flex;
  width: 100%;
  padding: 16px;
  gap: 8px;
  justify-content: start;
  flex-wrap: wrap;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const EventImage = styled.img`
  aspect-ratio: 1.85;
  object-fit: contain;
  object-position: center;
  width: 200px;
  border-radius: 8px;
  max-width: 100%;
  margin-right: 16px;
`;

const EventDetails = styled.div`
  min-width: 240px;
  padding-bottom: 12px;
  flex: 1;
  flex-shrink: 1;
  flex-basis: 16px;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const EventTitle = styled.a`
  display: block;
  font-family: Roboto, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  line-height: 2;
  margin-bottom: 16px;
  cursor: pointer;
`;

const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DateTime = styled.span`
  font-family: Roboto, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 12px;
  color: var(--primary-color);
  font-weight: 600;
  line-height: 1.6;
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: start;
  gap: 8px;
`;

const LocationDetails = styled.div`
  font-family: Roboto, -apple-system, Roboto, Helvetica, sans-serif;
`;

const VenueName = styled.div`
  color: var(--primary-color);
  font-size: 11px;
  font-weight: 600;
  line-height: 19px;
`;

const LocationText = styled.div`
  font-size: 12px;
  color: #c4c4cf;
  font-weight: 400;
  line-height: 18px;
`;

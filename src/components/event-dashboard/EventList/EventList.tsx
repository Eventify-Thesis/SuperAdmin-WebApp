import { EventListAllResponse } from '@/dto/event-doc.dto';
import { EventCard } from './EventCard';
import { Empty } from 'antd';
import styled from 'styled-components';

interface EventListProps {
  events: EventListAllResponse[];
  refetchEvents: () => void;
}
const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  min-height: 300px; // Adjust as needed
  width: 100%;
`;


const EventList: React.FC<EventListProps> = ({ events, refetchEvents }) => {
  return (
    <Container>
      {!events || events.length === 0 ? (
        <Empty />
      ) : (
        events.map((event, index) => (
          <EventCard key={index} {...event} refetchEvents={refetchEvents} />
        ))
      )}
    </Container>
  );
};
export default EventList;

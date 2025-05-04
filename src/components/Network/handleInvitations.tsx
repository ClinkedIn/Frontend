import axios from 'axios';
import { BASE_URL } from '../../constants';

export const handleAccept = async (invitationId: string) => {
  try {
    await axios.patch(`${BASE_URL}/user/connections/requests/${invitationId}`, { action: 'accept' });
    console.log(`Accepted invitation from ${invitationId}`);
  } catch (error) {
    console.error('Error accepting invitation:', error);
  }
};

export const handleIgnore = async (invitationId: string) => {
  try {
    await axios.patch(`${BASE_URL}/user/connections/requests/${invitationId}`, { action: 'ignore' });
    console.log(`Ignored invitation from ${invitationId}`);
  } catch (error) {
    console.error('Error ignoring invitation:', error);
  }
};
/**
 * HandleInvitations component for managing network connection invitations.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.invitationId - ID of the invitation to manage
 * @param {string} props.senderId - ID of the user who sent the invitation
 * @param {string} [props.senderName="Someone"] - Name of the sender for display
 * @param {Function} [props.onAccept] - Optional callback triggered after accepting an invitation
 * @param {Function} [props.onIgnore] - Optional callback triggered after ignoring an invitation
 * @param {Function} [props.onWithdraw] - Optional callback triggered after withdrawing an invitation
 * @param {string} [props.variant="standard"] - Visual variant ('standard', 'compact', 'button')
 * @param {boolean} [props.isSentByMe=false] - Whether the invitation was sent by the current user
 * 
 * @returns {JSX.Element} Rendered invitation management interface
 * 
 * @example
 * <HandleInvitations
 *   invitationId="inv123"
 *   senderId="user456"
 *   senderName="Jane Smith"
 *   onAccept={() => updateConnectionsList()}
 *   onIgnore={() => filterInvitations()}
 *   variant="standard"
 * />
 * 
 * @description
 * This component provides an interface for:
 * - Accepting incoming connection requests
 * - Ignoring/declining connection requests
 * - Withdrawing sent connection requests
 * - Showing appropriate actions based on who initiated the request
 * - Visual feedback during API operations
 * - Multiple display variants to fit different UI contexts
 */

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
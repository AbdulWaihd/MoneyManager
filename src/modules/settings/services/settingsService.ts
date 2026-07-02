import { 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from 'firebase/auth';
import { getCurrentUser } from '../../auth';
import { ChangePasswordFormData } from '../settingsSchemas';

export const updateUserPassword = async (data: ChangePasswordFormData): Promise<void> => {
    const user = getCurrentUser();
    if (!user || !user.email) {
        throw new Error('User not found');
    }

    // Re-authenticate first
    const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
    
    try {
        await reauthenticateWithCredential(user, credential);
        // Then update password
        await updatePassword(user, data.newPassword);
    } catch (error: any) {
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            throw new Error('Invalid current password');
        }
        throw error;
    }
};

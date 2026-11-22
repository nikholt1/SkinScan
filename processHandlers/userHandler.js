import { signInWithEmailAndPassword } from 'firebase/auth';

export let user = null;

export async function logIn(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        user=userCredential.user;
    } catch (error) {
        Alert.alert('Login failed', error.message);
        throw error;
    }
}
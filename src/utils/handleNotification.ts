import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';


const user = auth().currentUser;

export class HandleNotification {
  static checkNotificationPersion = async () => {
    const authStatus = await messaging().requestPermission();

    if (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      this.getFcmToken();
    }
  };

  static getFcmToken = async () => {
    const fcmtoken = await AsyncStorage.getItem('fcmtoken');
    if (!fcmtoken) {
      const token = await messaging().getToken();

      if (token) {
        await AsyncStorage.setItem('fcmtoken', token);
        this.UpdateToken(token);
      }
    }
  };

  static UpdateToken = async (token: string) => {
    await firestore()
      .doc(`users/${user?.uid}`)
      .get()
      .then(snap => {
        if (snap.exists) {
          const data: any = snap.data();

          if (!data.tokens || !data.tokens.includes(token)) {
            firestore()
              .doc(`users/${user?.uid}`)
              .update({
                tokens: firestore.FieldValue.arrayUnion(token),
              });
          }
        }
      });
  };

}

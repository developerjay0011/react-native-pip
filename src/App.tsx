import { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  Platform,
  useWindowDimensions,
} from 'react-native';
import PictureInPicture from 'react-native-pip';

export default function App() {
  const [isPipSupported, setIsPipSupported] = useState<boolean>(false);
  const [isPipActive, setIsPipActive] = useState<boolean>(false);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    // Check if PiP is supported on this device
    async function checkPipSupport() {
      const supported = await PictureInPicture.isPipSupported();
      setIsPipSupported(supported);
    }

    checkPipSupport();

    // Add PiP event listeners
    const enterListener = PictureInPicture.addEventListener(
      'onEnterPip',
      () => {
        console.log('Entered PiP mode');
        setIsPipActive(true);
      }
    );

    const exitListener = PictureInPicture.addEventListener('onExitPip', () => {
      console.log('Exited PiP mode');
      setIsPipActive(false);
    });

    const errorListener = PictureInPicture.addEventListener(
      'onError',
      (error) => {
        console.error('PiP error:', error);
      }
    );

    // Cleanup listeners
    return () => {
      enterListener();
      exitListener();
      errorListener();
    };
  }, []);

  const enterPiP = async () => {
    try {
      const screenRatio = width / height;
      await PictureInPicture.enterPictureInPicture({
        aspectRatio: {
          width: Math.round(screenRatio * 100),
          height: 100,
        },
        autoEnterOnBackground: true, // iOS only
      });
    } catch (error) {
      console.error('Failed to enter PiP:', error);
    }
  };

  const exitPiP = async () => {
    try {
      await PictureInPicture.exitPictureInPicture();
    } catch (error) {
      console.error('Failed to exit PiP:', error);
    }
  };

  return (
    <View style={[styles.container, isPipActive && styles.pipContainer]}>
      {!isPipActive ? (
        <>
          <Text style={styles.title}>React Native PiP Demo</Text>

          <Text style={styles.status}>
            PiP Support: {isPipSupported ? '✅' : '❌'}
          </Text>

          <Text style={styles.status}>
            PiP Active: {isPipActive ? '✅' : '❌'}
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Enter PiP Mode"
              onPress={enterPiP}
              disabled={!isPipSupported || isPipActive}
            />

            <Button
              title="Exit PiP Mode"
              onPress={exitPiP}
              disabled={!isPipSupported || !isPipActive}
            />
          </View>

          <Text style={styles.note}>
            Note: On {Platform.OS === 'ios' ? 'iOS' : 'Android'}, you might need
            to press the home button or use the system PiP controls to fully
            exit PiP mode.
          </Text>
        </>
      ) : (
        <View style={styles.pipContent}>
          <Text style={styles.pipText}>PiP Mode Active</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  status: {
    fontSize: 16,
    marginVertical: 5,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  note: {
    marginTop: 30,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  pipContainer: {
    backgroundColor: '#2196F3',
  },
  pipContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  pipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

/**
 * Pantalla de Términos y Condiciones de Uso para padres de niños de 1-5 años.
 */
export default function TermsAndConditionsScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#a8dadc', dark: '#1d3557' }} // Colores más amigables/temáticos
      headerImage={
        <IconSymbol
          size={310}
          color="#457b9d" 
          name="scroll.fill" 
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Reglas de Mamá y Papá 📜
        </ThemedText>
      </ThemedView>
      <ThemedText style={{ marginBottom: 15 }}>
        ¡Hola! Esta sección es para los padres y tutores. Lee estas reglas antes de que el pequeño empiece a jugar. Tu aceptación nos ayuda a mantener la app segura y divertida.
      </ThemedText>
      <ThemedText type="defaultSemiBold">
        Última actualización: 16 de Octubre de 2025
      </ThemedText>
      
      {/* --- Sección de Uso y Edad --- */}
      <Collapsible title="👶 Sobre el Usuario (Niños y Padres)">
        <ThemedText>
          Esta aplicación está diseñada para ser utilizada por niños entre {' '}
          <ThemedText type="defaultSemiBold">1 y 5 años</ThemedText>, siempre bajo la {' '}
          <ThemedText type="defaultSemiBold">supervisión de un adulto</ThemedText> (tutor o padre).
        </ThemedText>
        <ThemedText>
          Al usar la app, confirmas que eres un adulto responsable y aceptas estos términos en nombre del niño.
        </ThemedText>
      </Collapsible>

      {/* --- Sección de Seguridad y Privacidad (Adaptada a COPPA/GDPR-K) --- */}
      <Collapsible title="🔒 Privacidad de los Pequeños">
        <ThemedText>
          <ThemedText type="defaultSemiBold">No recopilamos información personal</ThemedText> del niño (nombre, fotos, ubicación, etc.) que lo pueda identificar.
        </ThemedText>
        <ThemedText>
          Usamos datos anónimos sobre cómo se usa la app (ej: qué juego es más popular) para mejorar la experiencia. ¡Solo para hacerla mejor!
        </ThemedText>
        {/* Enlace a la política de privacidad real */}
        <ExternalLink href="https://es.wikipedia.org/wiki/Pol%C3%ADtica_de_privacidad">
          <ThemedText type="link">Ver Política de Privacidad completa</ThemedText>
        </ExternalLink>
      </Collapsible>

      {/* --- Sección de Contenido y Comportamiento --- */}
      <Collapsible title="🚫 Prohibido: Anuncios y Compras">
        <ThemedText>
          Esta versión de la app {' '}
          <ThemedText type="defaultSemiBold">no tiene anuncios de terceros</ThemedText> ni enlaces a redes sociales. ¡Es un entorno seguro!
        </ThemedText>
        <ThemedText>
          Si hay compras dentro de la app, estas siempre requerirán la {' '}
          <ThemedText type="defaultSemiBold">confirmación de un adulto</ThemedText> con una clave o PIN.
        </ThemedText>
      </Collapsible>
      
      {/* --- Sección de Propiedad Intelectual (General) --- */}
      <Collapsible title="🎨 Contenido de la App">
        <ThemedText>
          Todos los dibujos, canciones y juegos son propiedad de [Nombre de la Empresa].
        </ThemedText>
        <ThemedText>
          Permitimos usar las capturas de pantalla de tu hijo en redes, ¡etiquétanos! Pero la {' '}
          <ThemedText type="defaultSemiBold">reproducción o copia</ThemedText> de nuestro contenido no está permitida.
        </ThemedText>
      </Collapsible>

      {/* --- Sección de Aceptación (Final) --- */}
      <ThemedView style={{ marginTop: 20 }}>
        <ThemedText type="subtitle" style={{ color: '#457b9d', fontFamily: Fonts.rounded }}>
            ¡Gracias por Cuidarnos!
        </ThemedText>
        <ThemedText>
            Al continuar usando la aplicación, aceptas automáticamente todas estas reglas. Si no estás de acuerdo, por favor desinstala la aplicación.
        </ThemedText>
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#457b9d', // Color del ícono en el header
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
});
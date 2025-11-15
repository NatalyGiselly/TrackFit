import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';

type WorkoutExecutionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'WorkoutExecution'
>;

type WorkoutExecutionScreenRouteProp = RouteProp<
  RootStackParamList,
  'WorkoutExecution'
>;

export const WorkoutExecutionScreen: React.FC = () => {
  const navigation = useNavigation<WorkoutExecutionScreenNavigationProp>();
  const route = useRoute<WorkoutExecutionScreenRouteProp>();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const isDark = theme === 'dark';

  const {exercises} = route.params;

  const backgroundColor = isDark ? '#000' : '#f8f9fa';
  const textColor = isDark ? '#fff' : '#1a1a1a';
  const cardBg = isDark ? '#1a1a1a' : '#fff';

  return (
    <SafeAreaView style={[styles.container, {backgroundColor}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, {color: textColor}]}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={[styles.title, {color: textColor}]}>Executar Treino</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, {backgroundColor: cardBg}]}>
          <Text style={[styles.sectionTitle, {color: textColor}]}>
            Exercícios Selecionados ({exercises.length})
          </Text>

          {exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseItem}>
              <Text style={[styles.exerciseNumber, {color: isDark ? '#87CEEB' : '#6BB6D9'}]}>
                {index + 1}
              </Text>
              <Text style={[styles.exerciseName, {color: textColor}]}>
                {exercise}
              </Text>
            </View>
          ))}
        </View>

        <Text style={[styles.infoText, {color: textColor}]}>
          🏗️ Tela de execução em desenvolvimento...
        </Text>
        <Text style={[styles.infoText, {color: textColor}]}>
          Aqui você poderá adicionar séries, repetições e acompanhar seu treino
          em tempo real.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    width: 60,
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  exerciseNumber: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 16,
    width: 30,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.6,
  },
});

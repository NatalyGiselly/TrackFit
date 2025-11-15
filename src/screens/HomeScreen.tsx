import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import {useAuth} from '../context/AuthContext';
import {FlameCounter} from '../components/FlameCounter';
import {ProgressTimeline} from '../components/ProgressTimeline';
import {CategoryButton} from '../components/CategoryButton';
import {MenuModal} from '../components/MenuModal';
import {ExerciseIcon} from '../components/ExerciseIcon';
import {FloatingActionBar} from '../components/FloatingActionBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {user, signOut} = useAuth();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const isDark = theme === 'dark';

  const [menuVisible, setMenuVisible] = useState(false);
  const [testActiveDays, setTestActiveDays] = useState(2);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  // Mock user progress data (will be replaced with real data later)
  const [workoutCount] = useState(12);
  const [calories] = useState(2450);
  const [minutes] = useState(240);

  // Get active days from user - TESTE: usando estado de teste
  const activeDays = testActiveDays;

  // Subcategorias para cada categoria principal
  const categorySubcategories = {
    Superiores: ['Bíceps', 'Tríceps', 'Costas', 'Ombro', 'Antebraço', 'Peito'],
    Inferiores: ['Quadríceps', 'Posterior', 'Glúteos', 'Panturrilha'],
    Core: ['Abdômen Reto', 'Lombar', 'Oblíquos', 'Transverso'],
    Aeróbico: ['Esteira', 'Escada', 'Elíptico', 'Bicicleta', 'HIIT'],
  };

  // Exercícios para cada subcategoria
  const exercisesBySubcategory: {[key: string]: string[]} = {
    // Superiores
    'Bíceps': [
      'Rosca Direta com Barra',
      'Rosca Alternada com Halter',
      'Rosca Martelo',
      'Rosca Concentrada',
      'Rosca Scott',
      'Rosca no Cabo',
      'Rosca Inversa',
      'Rosca 21',
      'Rosca Spider',
    ],
    'Tríceps': [
      'Tríceps Testa',
      'Tríceps na Polia',
      'Tríceps Francês',
      'Mergulho',
      'Tríceps Coice',
      'Supino Fechado',
      'Tríceps na Máquina',
      'Tríceps Corda',
      'Tríceps Barra',
    ],
    'Costas': [
      'Puxada Frontal',
      'Puxada Triângulo',
      'Remada Curvada',
      'Remada Cavalinho',
      'Remada Unilateral',
      'Pull-up',
      'Pulley',
      'Serrote',
      'Levantamento Terra',
      'Remada na Máquina',
      'Puxada Aberta',
      'Remada Baixa',
    ],
    'Ombro': [
      'Desenvolvimento com Barra',
      'Desenvolvimento com Halter',
      'Elevação Lateral',
      'Elevação Frontal',
      'Remada Alta',
      'Crucifixo Inverso',
      'Desenvolvimento na Máquina',
      'Elevação Lateral no Cabo',
      'Arnold Press',
    ],
    'Antebraço': [
      'Rosca Punho',
      'Rosca Inversa',
      'Pegada Estática',
      'Flexão de Punho',
      'Extensão de Punho',
      'Rosca Martelo',
    ],
    'Peito': [
      'Supino Reto',
      'Supino Inclinado',
      'Supino Declinado',
      'Crucifixo Reto',
      'Crucifixo Inclinado',
      'Peck Deck',
      'Crossover',
      'Flexão',
      'Supino na Máquina',
      'Crossover Inclinado',
      'Crucifixo no Cabo',
    ],
    // Inferiores
    'Quadríceps': [
      'Agachamento Livre',
      'Leg Press 45°',
      'Cadeira Extensora',
      'Agachamento Hack',
      'Afundo',
      'Búlgaro',
      'Sissy Squat',
      'Agachamento Sumô',
      'Leg Press Horizontal',
      'Passada',
    ],
    'Posterior': [
      'Stiff',
      'Mesa Flexora',
      'Levantamento Terra',
      'Good Morning',
      'Mesa Flexora Unilateral',
      'Stiff Unilateral',
      'Flexora em Pé',
      'Cadeira Flexora',
    ],
    'Glúteos': [
      'Hip Thrust',
      'Agachamento Sumô',
      'Elevação Pélvica',
      'Abdutor na Máquina',
      'Coice no Cabo',
      'Glúteo 4 Apoios',
      'Cadeira Abdutora',
      'Stiff',
      'Hip Thrust Unilateral',
    ],
    'Panturrilha': [
      'Panturrilha em Pé',
      'Panturrilha Sentado',
      'Leg Press Panturrilha',
      'Panturrilha Unilateral',
      'Elevação no Step',
      'Panturrilha no Smith',
    ],
    // Core
    'Abdômen Reto': [
      'Abdominal Reto',
      'Prancha',
      'Elevação de Pernas',
      'Abdominal Canivete',
      'Abdominal na Máquina',
      'Abdominal no Banco Inclinado',
      'Abdominal Bicicleta',
      'Abdominal Supra',
      'Elevação de Joelhos',
    ],
    'Lombar': [
      'Extensão Lombar',
      'Superman',
      'Good Morning',
      'Hiperextensão',
      'Prancha Lombar',
      'Hiperextensão Inversa',
    ],
    'Oblíquos': [
      'Abdominal Oblíquo',
      'Russian Twist',
      'Prancha Lateral',
      'Wood Chop',
      'Oblíquo no Cabo',
      'Bicicleta',
      'Prancha com Rotação',
    ],
    'Transverso': [
      'Prancha Frontal',
      'Vacuum',
      'Dead Bug',
      'Bird Dog',
      'Prancha com Elevação',
      'Hollow Hold',
    ],
    // Aeróbico
    'Esteira': [
      'Caminhada',
      'Corrida Leve',
      'Corrida Moderada',
      'Corrida Intensa',
      'Inclinação',
      'Tiro',
      'Caminhada Inclinada',
    ],
    'Escada': [
      'Subida Moderada',
      'Subida Intensa',
      'Intervalos',
      'Escada Rolante',
      'Step Climber',
    ],
    'Elíptico': [
      'Baixa Intensidade',
      'Média Intensidade',
      'Alta Intensidade',
      'Intervalos',
      'Elíptico Reverso',
    ],
    'Bicicleta': [
      'Pedalada Leve',
      'Pedalada Moderada',
      'Pedalada Intensa',
      'Spinning',
      'Bike Ergométrica',
      'Intervalos',
    ],
    'HIIT': [
      'Burpees',
      'Jump Squat',
      'Mountain Climbers',
      'High Knees',
      'Jumping Jacks',
      'Box Jump',
      'Polichinelo',
      'Skipping',
      'Burpee Box Jump',
      'Tuck Jump',
    ],
  };

  const backgroundColor = isDark ? '#000' : '#f8f9fa';
  const textColor = isDark ? '#fff' : '#1a1a1a';
  const sectionBg = isDark ? '#1a1a1a' : '#fff';
  const subtitleColor = isDark ? '#aaa' : '#666';
  const progressBoxBg = isDark ? '#2a2a2a' : '#f5f5f5';

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Tem certeza que deseja sair?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ],
    );
  };

  const handleCategory = (category: string) => {
    // Toggle expandir/colapsar categoria
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleSubcategory = (subcategory: string) => {
    // Toggle expandir/colapsar exercícios da subcategoria
    setExpandedSubcategory(expandedSubcategory === subcategory ? null : subcategory);
  };

  const handleExerciseToggle = (exercise: string) => {
    console.log('🎯 Toggle exercise:', exercise);
    setSelectedExercises(prev => {
      const newList = prev.includes(exercise)
        ? prev.filter(ex => ex !== exercise)
        : [...prev, exercise];
      console.log('📝 Selected exercises:', newList);
      console.log('🔢 Count:', newList.length);
      return newList;
    });
  };

  const handleSaveWorkout = () => {
    if (selectedExercises.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um exercício');
      return;
    }

    Alert.prompt(
      'Salvar Treino',
      'Digite um nome para o treino:',
      async (workoutName) => {
        if (!workoutName || workoutName.trim() === '') {
          Alert.alert('Erro', 'O nome do treino não pode estar vazio');
          return;
        }

        try {
          // Get existing workouts
          const savedWorkoutsJson = await AsyncStorage.getItem('@saved_workouts');
          const savedWorkouts = savedWorkoutsJson ? JSON.parse(savedWorkoutsJson) : [];

          // Create new workout
          const newWorkout = {
            id: Date.now().toString(),
            name: workoutName.trim(),
            exercises: selectedExercises,
            createdAt: new Date().toISOString(),
          };

          // Save to storage
          const updatedWorkouts = [...savedWorkouts, newWorkout];
          await AsyncStorage.setItem('@saved_workouts', JSON.stringify(updatedWorkouts));

          Alert.alert('Sucesso', `Treino "${workoutName}" salvo com sucesso!`);

          // Clear selection
          setSelectedExercises([]);
        } catch (error) {
          console.error('Error saving workout:', error);
          Alert.alert('Erro', 'Não foi possível salvar o treino');
        }
      },
    );
  };

  const handleStartWorkout = () => {
    if (selectedExercises.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um exercício');
      return;
    }

    navigation.navigate('WorkoutExecution', {exercises: selectedExercises});
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor}]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, {color: textColor}]}>
                {user?.username || 'Usuário'}
              </Text>
              <FlameCounter count={activeDays} theme={theme} />
            </View>
          </View>

          {/* Menu Button */}
          <TouchableOpacity
            style={[styles.menuButton, {backgroundColor: sectionBg}]}
            onPress={() => setMenuVisible(true)}
            activeOpacity={0.7}>
            <View style={styles.menuIcon}>
              <View style={[styles.menuLine, {backgroundColor: textColor}]} />
              <View style={[styles.menuLine, {backgroundColor: textColor}]} />
              <View style={[styles.menuLine, {backgroundColor: textColor}]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* TESTE: Botões para testar animação */}
        <View style={[styles.testButtons, {backgroundColor: sectionBg}]}>
          <Text style={[styles.testLabel, {color: textColor}]}>
            Testar animação:
          </Text>
          <View style={styles.testButtonsRow}>
            <TouchableOpacity
              style={[styles.testButton, {backgroundColor: '#007AFF'}]}
              onPress={() => setTestActiveDays(0)}>
              <Text style={styles.testButtonText}>0 dias</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.testButton, {backgroundColor: '#007AFF'}]}
              onPress={() => setTestActiveDays(1)}>
              <Text style={styles.testButtonText}>1 dia</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.testButton, {backgroundColor: '#007AFF'}]}
              onPress={() => setTestActiveDays(2)}>
              <Text style={styles.testButtonText}>2 dias</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.testButton, {backgroundColor: '#007AFF'}]}
              onPress={() => setTestActiveDays(5)}>
              <Text style={styles.testButtonText}>5 dias</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Section */}
        <View style={[styles.section, {backgroundColor: sectionBg}]}>
          <Text style={[styles.sectionTitle, {color: textColor}]}>
            Seu Progresso, {user?.username || 'Usuário'}
          </Text>
          <View style={[styles.progressBox, {backgroundColor: progressBoxBg}]}>
            <ProgressTimeline
              items={[
                {label: 'Treinos', value: workoutCount, icon: '💪'},
                {label: 'Kcal', value: calories, icon: '🔥'},
                {label: 'Minutos', value: minutes, icon: '⏱️'},
              ]}
              theme={theme}
            />
          </View>
        </View>

        {/* Workout Builder Section */}
        <View style={[styles.section, {backgroundColor: sectionBg}]}>
          <Text style={[styles.sectionTitle, {color: textColor, fontSize: 20}]}>
            Monte seu treino
          </Text>

          <View style={styles.categoryHeader}>
            <ExerciseIcon size={28} color="#000000" />
            <Text style={[styles.categoryTitle, {color: '#000'}]}>
              Categorias
            </Text>
          </View>

          <View style={styles.categories}>
            <CategoryButton
              label="Superiores"
              onPress={() => handleCategory('Superiores')}
              theme={theme}
              subcategories={categorySubcategories.Superiores}
              isExpanded={expandedCategory === 'Superiores'}
              onSubcategoryPress={handleSubcategory}
              exercisesBySubcategory={exercisesBySubcategory}
              expandedSubcategory={expandedSubcategory}
              selectedExercises={selectedExercises}
              onExerciseToggle={handleExerciseToggle}
            />
            <CategoryButton
              label="Inferiores"
              onPress={() => handleCategory('Inferiores')}
              theme={theme}
              subcategories={categorySubcategories.Inferiores}
              isExpanded={expandedCategory === 'Inferiores'}
              onSubcategoryPress={handleSubcategory}
              exercisesBySubcategory={exercisesBySubcategory}
              expandedSubcategory={expandedSubcategory}
              selectedExercises={selectedExercises}
              onExerciseToggle={handleExerciseToggle}
            />
            <CategoryButton
              label="Core"
              onPress={() => handleCategory('Core')}
              theme={theme}
              subcategories={categorySubcategories.Core}
              isExpanded={expandedCategory === 'Core'}
              onSubcategoryPress={handleSubcategory}
              exercisesBySubcategory={exercisesBySubcategory}
              expandedSubcategory={expandedSubcategory}
              selectedExercises={selectedExercises}
              onExerciseToggle={handleExerciseToggle}
            />
            <CategoryButton
              label="Aeróbico"
              onPress={() => handleCategory('Aeróbico')}
              theme={theme}
              subcategories={categorySubcategories.Aeróbico}
              isExpanded={expandedCategory === 'Aeróbico'}
              onSubcategoryPress={handleSubcategory}
              useCircleIcon={true}
              exercisesBySubcategory={exercisesBySubcategory}
              expandedSubcategory={expandedSubcategory}
              selectedExercises={selectedExercises}
              onExerciseToggle={handleExerciseToggle}
            />
          </View>
        </View>
      </ScrollView>

      {/* Menu Modal */}
      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onAccount={() => navigation.navigate('Account')}
        onWorkouts={() => Alert.alert('Treinos', 'Em desenvolvimento')}
        onSubscription={() => Alert.alert('Assinatura', 'Em desenvolvimento')}
        onLogout={handleLogout}
        theme={theme}
      />

      {/* Floating Action Bar */}
      <FloatingActionBar
        visible={selectedExercises.length > 0}
        onSave={handleSaveWorkout}
        onStart={handleStartWorkout}
        theme={theme}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  userInfo: {
    gap: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    gap: 4,
  },
  menuLine: {
    width: 20,
    height: 2,
    borderRadius: 1,
  },
  section: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  progressBox: {
    borderRadius: 12,
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 16,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dumbbellIcon: {
    fontSize: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  categories: {
    gap: 0,
  },
  testButtons: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  testButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  testButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

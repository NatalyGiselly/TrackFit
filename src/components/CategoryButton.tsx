import React, {useEffect, useRef} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {ArrowIcon} from './ArrowIcon';
import {CircleIcon} from './CircleIcon';
import {CheckboxIcon} from './CheckboxIcon';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CategoryButtonProps {
  label: string;
  onPress: () => void;
  theme: 'light' | 'dark';
  subcategories?: string[];
  isExpanded?: boolean;
  onSubcategoryPress?: (subcategory: string) => void;
  useCircleIcon?: boolean;
  exercisesBySubcategory?: {[key: string]: string[]};
  expandedSubcategory?: string | null;
  selectedExercises?: string[];
  onExerciseToggle?: (exercise: string) => void;
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({
  label,
  onPress,
  theme,
  subcategories = [],
  isExpanded = false,
  onSubcategoryPress,
  useCircleIcon = false,
  exercisesBySubcategory = {},
  expandedSubcategory = null,
  selectedExercises = [],
  onExerciseToggle,
}) => {
  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#2a2a2a' : '#fff';
  const textColor = isDark ? '#fff' : '#1a1a1a';
  const subBgColor = isDark ? '#1a1a1a' : '#f5f5f5';
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, {backgroundColor}]}
        onPress={onPress}
        activeOpacity={0.7}>
        <View style={styles.content}>
          <Animated.View style={{transform: [{rotate: rotation}]}}>
            <ArrowIcon size={13} color="#000000" />
          </Animated.View>
          <Text style={[styles.label, {color: textColor}]}>{label}</Text>
        </View>
      </TouchableOpacity>

      {isExpanded && subcategories.length > 0 && (
        <View style={[styles.subcategoriesContainer, {backgroundColor: subBgColor}]}>
          {subcategories.map((sub, index) => {
            const exercises = exercisesBySubcategory[sub] || [];
            const isSubExpanded = expandedSubcategory === sub;

            return (
              <View key={index}>
                <TouchableOpacity
                  style={styles.subcategoryButton}
                  onPress={() => onSubcategoryPress?.(sub)}
                  activeOpacity={0.7}>
                  <View style={styles.subcategoryContent}>
                    {useCircleIcon ? (
                      <CircleIcon size={14} color="#000000" />
                    ) : (
                      <ArrowIcon size={11} color="#000000" />
                    )}
                    <Text style={[styles.subcategoryLabel, {color: textColor}]}>
                      {sub}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Exercise List */}
                {isSubExpanded && exercises.length > 0 && (
                  <View style={styles.exercisesContainer}>
                    {exercises.map((exercise, exIndex) => {
                      const isChecked = selectedExercises.includes(exercise);
                      return (
                        <TouchableOpacity
                          key={exIndex}
                          style={styles.exerciseRow}
                          onPress={() => onExerciseToggle?.(exercise)}
                          activeOpacity={0.7}>
                          <CheckboxIcon
                            size={24}
                            color="#000000"
                            checked={isChecked}
                          />
                          <Text style={[styles.exerciseLabel, {color: textColor}]}>
                            {exercise}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  subcategoriesContainer: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
    marginTop: -8,
  },
  subcategoryButton: {
    paddingVertical: 10,
    paddingLeft: 6,
  },
  subcategoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subcategoryLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  exercisesContainer: {
    paddingLeft: 30,
    paddingTop: 8,
    paddingBottom: 4,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 6,
  },
  exerciseLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
});

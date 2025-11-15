import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {TreinoIcon} from './TreinoIcon';
import {LogoutIcon} from './LogoutIcon';
import {AssinaturaIcon} from './AssinaturaIcon';
import {AccountIcon} from './AccountIcon';

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
  onAccount: () => void;
  onWorkouts: () => void;
  onSubscription: () => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
}

export const MenuModal: React.FC<MenuModalProps> = ({
  visible,
  onClose,
  onAccount,
  onWorkouts,
  onSubscription,
  onLogout,
  theme,
}) => {
  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#1a1a1a' : '#fff';
  const textColor = isDark ? '#fff' : '#1a1a1a';
  const separatorColor = isDark ? '#333' : '#e0e0e0';

  const menuItems = [
    {
      label: 'Conta',
      onPress: onAccount,
      icon: <AccountIcon size={20} color={textColor} />,
    },
    {
      label: 'Treinos',
      onPress: onWorkouts,
      icon: <TreinoIcon size={24} color={textColor} />,
    },
    {
      label: 'Assinatura',
      onPress: onSubscription,
      icon: <AssinaturaIcon size={20} color={textColor} />,
    },
    {
      label: 'Logout',
      onPress: onLogout,
      icon: <LogoutIcon size={20} color={textColor} />,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.menu, {backgroundColor}]}>
              {menuItems.map((item, index) => (
                <React.Fragment key={item.label}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      item.onPress();
                      onClose();
                    }}
                    activeOpacity={0.7}>
                    {typeof item.icon === 'string' ? (
                      <Text style={styles.menuIcon}>{item.icon}</Text>
                    ) : (
                      <View style={styles.menuIcon}>{item.icon}</View>
                    )}
                    <Text style={[styles.menuText, {color: textColor}]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                  {index < menuItems.length - 1 && (
                    <View style={[styles.separator, {backgroundColor: separatorColor}]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  menu: {
    borderRadius: 12,
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuIcon: {
    fontSize: 20,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
});

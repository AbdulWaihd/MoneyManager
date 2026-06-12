import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING } from '../../src/constants/spacing';
import { TYPOGRAPHY } from '../../src/constants/typography';
import TextInput from '../../src/components/ui/TextInput';
import Button from '../../src/components/ui/Button';
import Checkbox from '../../src/components/ui/Checkbox';
import { useAuth } from '../../src/context/AuthContext';
import { useLoading } from '../../src/context/LoadingContext';
import { loginUser } from '../../src/services/firebase/auth';
import { setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from '../../src/services/firebase/config';



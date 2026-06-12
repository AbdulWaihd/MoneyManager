import React from 'react';
import {TouchableOpacity,Text,ActivityIndicator,View} from 'react-native';
import {COLORS} from '../../constants/colors';
import {SPACING} from '../../constants/spacing';
import {TYPOGRAPHY} from '../../constants/typography';

interface ButtonProps{

    label:string;
    onPress:()=>void;
    disabled?:boolean;
    variant?:'primary'|'secondary'|'tertiary';
    loading:boolean;
    full?:boolean;
}

export default function Button({
    label,
    onPress,
    variant='primary',
    disabled=false,
    loading=false,
    full=false,
}:ButtonProps) {

    const isPrimary=variant==='primary';
    const isSecondary=variant==='secondary';
    const isTertiary=variant==='tertiary';

    return(
        <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={{
        backgroundColor: isPrimary ? COLORS.primary : 'transparent',
        borderWidth: isPrimary ? 0 : 1,
        borderColor: isPrimary ? 'transparent' : COLORS.primary,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: SPACING.lg,
        opacity: disabled ? 0.5 : 1,
        width: full ? '100%' : 'auto',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
           {loading ? (
        <ActivityIndicator color={isPrimary ? COLORS.surface : COLORS.primary} />
      ) : (
        <Text
          style={{
            color: isPrimary ? COLORS.surface : COLORS.primary,
            fontSize: TYPOGRAPHY.sizes.base,
            fontWeight: '600',
            fontFamily: TYPOGRAPHY.fonts.body,
          }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
    );
}
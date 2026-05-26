declare module 'nativewind/styled' {
    import { ComponentType } from 'react';
    import { ViewProps, TextProps, ImageProps, TouchableOpacityProps } from 'react-native';

    export function styled<T>(Component: ComponentType<T>): ComponentType<T & { className?: string }>;
}

declare module 'nativewind/utils/cn' {
    export function cn(...inputs: (string | undefined | null | false)[]): string;
} 
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Controller, Control } from 'react-hook-form';

interface FormFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  rules?: object;
  defaultValue?: string;
  errors?: any;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  control,
  rules = {},
  defaultValue = '',
  errors,
}) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              errors ? { borderColor: 'red' } : { borderColor: '#ddd' },
            ]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors && <Text style={styles.errorText}>{errors.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
});

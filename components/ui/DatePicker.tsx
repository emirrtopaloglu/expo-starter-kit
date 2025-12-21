import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Typography } from './Typography';
import { Box } from './Box';
import { Input } from './Input';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react-native';

interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange: (date: Date) => void;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const DatePicker = ({
  label,
  value,
  onChange,
  error,
  minDate,
  maxDate,
}: DatePickerProps) => {
  const { theme, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Strict internal state
  const [tempDate, setTempDate] = useState<Date>(value || new Date());

  // Sync on open
  React.useEffect(() => {
    if (isOpen) {
      setTempDate(value || new Date());
    }
  }, [isOpen, value]);

  const year = tempDate.getFullYear();
  const month = tempDate.getMonth();

  const displayValue = useMemo(() => {
    if (!value) return '';
    return value.toLocaleDateString();
  }, [value]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [year, month]);

  const changeMonth = (delta: number) => {
    const newDate = new Date(tempDate);
    newDate.setMonth(tempDate.getMonth() + delta);
    setTempDate(newDate);
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(tempDate);
    newDate.setDate(day);
    setTempDate(newDate);
  };

  const confirmSelection = () => {
    onChange(tempDate);
    setIsOpen(false);
  };

  const isSelected = (d: number) => {
    return d === tempDate.getDate();
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
        style={{ marginBottom: 16 }}
      >
        <View pointerEvents="none">
          <Input
            label={label}
            value={displayValue}
            placeholder="Select date"
            editable={false}
            error={error}
            rightIcon={<CalendarIcon size={20} color={theme.colors.text.subtle} />}
            style={{ color: !value ? theme.colors.text.subtle : theme.colors.text.default }}
          />
        </View>
      </TouchableOpacity>

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="Select Date">
        <View style={{ minHeight: 350 }}>
          <Box p="sm">
            <Box
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => changeMonth(-1)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ChevronLeft color={theme.colors.text.default} />
              </TouchableOpacity>
              <Typography variant="h4">
                {MONTHS[month]} {year}
              </Typography>
              <TouchableOpacity
                onPress={() => changeMonth(1)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ChevronRight color={theme.colors.text.default} />
              </TouchableOpacity>
            </Box>

            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              {DAYS.map((d) => (
                <View key={d} style={{ flex: 1, alignItems: 'center' }}>
                  <Typography
                    variant="caption"
                    style={{ fontWeight: 'bold', color: theme.colors.text.subtle }}
                  >
                    {d}
                  </Typography>
                </View>
              ))}
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {calendarDays.map((dateObj, i) => {
                if (!dateObj) return <View key={i} style={{ width: '14.28%', aspectRatio: 1 }} />;
                const dayNum = dateObj.getDate();
                const selected = isSelected(dayNum);
                return (
                  <TouchableOpacity
                    key={i}
                    style={{
                      width: '14.28%',
                      aspectRatio: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => handleDateSelect(dayNum)}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: selected ? theme.colors.primary : 'transparent',
                      }}
                    >
                      <Typography
                        style={{
                          color: selected ? 'white' : theme.colors.text.default,
                          fontWeight: selected ? 'bold' : 'normal',
                        }}
                      >
                        {dayNum}
                      </Typography>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Box mt="xl">
              <Button label="Confirm" onPress={confirmSelection} />
            </Box>
          </Box>
        </View>
      </BottomSheet>
    </>
  );
};

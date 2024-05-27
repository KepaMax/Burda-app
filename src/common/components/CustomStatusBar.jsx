import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StyledView } from './StyledComponents';

const CustomStatusBar = ({ backgroundColor, progressColor, progress }) => {
    return (
        <StyledView style={{ backgroundColor: backgroundColor }} className={`w-full h-[3px] rounded-full`}>
            <StyledView style={{ width: `${progress}%`, backgroundColor: progressColor }} className=' h-[3px] rounded-full'></StyledView>
        </StyledView>
    );
};

export default CustomStatusBar

const styles = StyleSheet.create({})
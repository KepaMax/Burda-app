import React from 'react'
import { content } from '../../tailwind.config'
import Accordion from './components/Accordion'
import { StyledText, StyledView } from '../common/components/StyledComponents'

const FAQ = () => {

    const data = [
        {
            title: "Lorem ipsum",
            content: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum  Lorem ipsum Lorem ipsum Lorem ipsum "
        },
        {
            title: "LoreAm ipsum",
            content: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum  Lorem ipsum Lorem ipsum Lorem ipsum "
        },
        {
            title: "Lorem ipsum",
            content: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum  Lorem ipsum Lorem ipsum Lorem ipsum "
        },
        {
            title: "Lorem ipsum",
            content: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum  Lorem ipsum Lorem ipsum Lorem ipsum "
        },
        {
            title: "Lorem ipsum",
            content: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum  Lorem ipsum Lorem ipsum Lorem ipsum "
        },
        {
            title: "Lorem ipsum",
            content: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum  Lorem ipsum Lorem ipsum Lorem ipsum "
        },
    ]

    return (
        <StyledView className='flex-1 bg-white p-4 '>
            <StyledText className='text-base font-poppi-bold mb-2 text-[#204F50]'>Top questions</StyledText>
            <Accordion items={data} />
        </StyledView>
    )
}

export default FAQ
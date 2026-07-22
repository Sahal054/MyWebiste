"use client";

import * as React from 'react'
import { Tabs as RadixTabs } from 'radix-ui'

type TabSize = 'sm' | 'md' | 'lg' | 'xl'

interface TabsRootProps {
    className?: string
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
    orientation?: 'horizontal' | 'vertical'
    size?: TabSize
    children: React.ReactNode
}

interface TabsListProps {
    className?: string
    'aria-label'?: string
    orientation?: 'horizontal' | 'vertical'
    children: React.ReactNode
}

interface TabsTriggerProps {
    className?: string
    value: string
    children: React.ReactNode
    icon?: React.ReactNode
    color?: string
}

interface TabsLabelProps {
    className?: string
    children: React.ReactNode
}

interface TabsContentProps {
    className?: string
    value: string
    children: React.ReactNode
}

const TabsContext = React.createContext<TabSize>('sm')

interface PresentationModeContextValue {
    isPresenting: boolean
    isPortrait?: boolean
}

const PresentationModeContext = React.createContext<PresentationModeContextValue>({ isPresenting: false })
export { PresentationModeContext }

const TabsRoot = ({
    className,
    defaultValue,
    value,
    onValueChange,
    orientation = 'vertical',
    size = 'sm',
    children,
}: TabsRootProps): React.JSX.Element => {
    const presentationContext = React.useContext(PresentationModeContext)
    const effectiveSize = presentationContext.isPresenting && size === 'lg' ? 'sm' : size

    return (
        <TabsContext.Provider value={effectiveSize}>
            <RadixTabs.Root
                className={`flex items-start w-full ${orientation === 'vertical' ? '' : 'flex-col'} ${className}`}
                defaultValue={defaultValue}
                value={value}
                onValueChange={onValueChange}
                orientation={orientation}
            >
                {children}
            </RadixTabs.Root>
        </TabsContext.Provider>
    )
}

const TabsList = ({ 'aria-label': ariaLabel, orientation, className, children }: TabsListProps): React.JSX.Element => {
    return (
        <RadixTabs.List
            className={`flex shrink-0 p-1 gap-0.5 min-w-52 ${className} ${
                orientation === 'vertical' ? 'flex-col' : ''
            }`}
            aria-label={ariaLabel}
        >
            {children}
        </RadixTabs.List>
    )
}

const TabsTrigger = ({ className, value, children, icon, color }: TabsTriggerProps): React.JSX.Element => {
    const size = React.useContext(TabsContext)
    const sizeStyles = {
        sm: { height: 'h-[45px]', fontSize: 'text-[15px]', padding: icon ? 'p-1' : 'px-3 py-2' },
        md: { height: 'h-[50px]', fontSize: 'text-base', padding: icon ? 'p-1.5' : 'px-4 py-2.5' },
        lg: { height: 'h-[55px]', fontSize: 'text-xl', padding: icon ? 'p-2' : 'px-5 py-3' },
        xl: { height: 'h-[60px]', fontSize: 'text-xl', padding: icon ? 'p-2.5' : 'px-6 py-3.5' },
    }
    const currentSize = sizeStyles[size]

    return (
        <RadixTabs.Trigger
            className={`flex w-full ${currentSize.height} flex-1 gap-2 cursor-default select-none items-center ${currentSize.fontSize} leading-tight text-primary rounded outline-none hover:text-primary hover:bg-accent data-[state=active]:font-bold data-[state=active]:bg-accent ${currentSize.padding} ${className}`}
            value={value}
        >
            {icon && color && (
                <span className={`bg-${color}/10 p-1 rounded size-7 text-${color}`}>
                    {icon}
                </span>
            )}
            {children}
        </RadixTabs.Trigger>
    )
}

const TabsLabel = ({ className, children }: TabsLabelProps): React.JSX.Element => {
    return <div className={`text-xs mx-2 pt-2 pb-2 mb-1 font-normal text-secondary border-b border-primary ${className || ''}`}>{children}</div>
}

const TabsContent = ({ className, value, children }: TabsContentProps): React.JSX.Element => {
    const size = React.useContext(TabsContext)
    const sizeStyles = {
        sm: 'grow rounded bg-white px-5 py-2 text-[15px] outline-none',
        md: 'grow rounded bg-white px-6 py-3 text-base outline-none',
        lg: 'grow rounded bg-white px-7 py-4 text-lg outline-none',
        xl: 'grow rounded bg-white px-8 py-5 text-xl outline-none',
    }
    return (
        <RadixTabs.Content className={className || sizeStyles[size]} value={value}>
            {children}
        </RadixTabs.Content>
    )
}

const Tabs = {
    Root: TabsRoot,
    List: TabsList,
    Trigger: TabsTrigger,
    Label: TabsLabel,
    Content: TabsContent,
}

export default Tabs
"use client";

import React, { useState, useEffect, useMemo, forwardRef } from 'react'
import { Select as RadixSelect } from 'radix-ui'
import { Check, ChevronDown } from 'lucide-react'
import { useApp } from '../../context/App'

type SelectItem = {
    value: string
    label: string
    disabled?: boolean
    icon?: React.ReactNode
    color?: string
}

type SelectGroup = {
    label: string
    items: SelectItem[]
}

type SelectProps = {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    placeholder?: string
    disabled?: boolean
    required?: boolean
    name?: string
    ariaLabel?: string
    groups: SelectGroup[]
    dataScheme?: string
    className?: string
}

const SelectItemComponent = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof RadixSelect.Item>>(
    ({ children, className, ...props }, forwardedRef) => {
        return (
            <RadixSelect.Item
                data-scheme="primary"
                className={`hover:bg-accent relative flex h-[25px] select-none items-center rounded pl-8 pr-4 text-sm leading-none text-primary bg-primary data-[disabled]:pointer-events-none data-[disabled]:text-muted data-[disabled]:cursor-not-allowed data-[highlighted]:text-primary data-[highlighted]:outline-none data-[state=checked]:font-medium ${className}`}
                {...props}
                ref={forwardedRef}
            >
                <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator className="absolute left-1 inline-flex w-[25px] items-center justify-center">
                    <Check className="size-4 text-primary" />
                </RadixSelect.ItemIndicator>
            </RadixSelect.Item>
        )
    }
)
SelectItemComponent.displayName = 'SelectItem'

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
    ({ value, defaultValue, onValueChange, placeholder, disabled, required, name, ariaLabel, groups, className, dataScheme }, ref) => {
        const [isClient, setIsClient] = useState(false)
        const { websiteMode } = useApp()
        const [appContainer, setAppContainer] = useState<HTMLElement | null>(null)

        useEffect(() => {
            setIsClient(true)
            if (websiteMode) {
                setAppContainer(document.getElementById('app-container'))
            }
        }, [websiteMode])

        const selectedItem = useMemo(() => {
            const currentValue = value ?? defaultValue
            if (currentValue === undefined) return null
            for (const group of groups) {
                const item = group.items.find((i) => i.value === currentValue)
                if (item !== undefined) return item
            }
            return null
        }, [value, defaultValue, groups])

        if (!isClient) {
            return (
                <div className="flex items-center" data-scheme={dataScheme}>
                    <button
                        ref={ref}
                        className={`flex justify-between items-center gap-1 rounded px-2 py-1 text-sm leading-none text-primary bg-primary outline-none border border-primary disabled:border-primary data-[placeholder]:text-muted disabled:cursor-not-allowed ${className}`}
                        disabled={disabled}
                        aria-label={ariaLabel}
                        data-scheme="primary"
                    >
                        <span className="text-muted">{placeholder || 'Select...'}</span>
                        <ChevronDown className="size-4 text-muted" />
                    </button>
                </div>
            )
        }

        return (
            <div className="flex items-center" data-scheme={dataScheme}>
                <RadixSelect.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled} required={required} name={name}>
                    <RadixSelect.Trigger
                        ref={ref}
                        className={`flex justify-between items-center gap-1 rounded px-2 py-1 text-sm leading-none text-primary bg-primary outline-none border border-primary disabled:border-primary data-[placeholder]:text-muted disabled:cursor-not-allowed ${className}`}
                        aria-label={ariaLabel}
                        data-scheme={dataScheme}
                    >
                        <RadixSelect.Value placeholder={placeholder}>
                            {selectedItem && (
                                <span className="flex space-x-1 items-center">
                                    {selectedItem.icon && <span className={`size-4 ${selectedItem.color ? `text-${selectedItem.color}` : ''}`}>{selectedItem.icon}</span>}
                                    <span className={`${selectedItem.label?.length > 20 ? 'text-xs' : ''}`}>{selectedItem.label}</span>
                                </span>
                            )}
                        </RadixSelect.Value>
                        <RadixSelect.Icon className="text-muted">
                            <ChevronDown className="size-4" />
                        </RadixSelect.Icon>
                    </RadixSelect.Trigger>
                    <RadixSelect.Portal>
                        <RadixSelect.Content position={appContainer ? 'popper' : undefined} collisionBoundary={appContainer} className="overflow-hidden rounded bg-white dark:bg-accent-dark shadow-xl z-[50]" data-scheme={dataScheme}>
                            <RadixSelect.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center bg-white dark:bg-accent-dark text-secondary">
                                <ChevronDown className="size-4 rotate-180" />
                            </RadixSelect.ScrollUpButton>
                            <RadixSelect.Viewport className="p-1">
                                {groups.map((group, groupIndex) => (
                                    <React.Fragment key={`group-${groupIndex}-${group.label}`}>
                                        <RadixSelect.Group>
                                            <RadixSelect.Label className="px-8 text-sm leading-[25px] text-muted" data-scheme="primary">
                                                {group.label}
                                            </RadixSelect.Label>
                                            {group.items.map((item, itemIndex) => (
                                                <SelectItemComponent key={`item-${groupIndex}-${itemIndex}-${item.value}`} value={item.value} disabled={item.disabled} className="text-primary dark:text-primary-dark">
                                                    <span className="flex space-x-1 items-center">
                                                        {item.icon && <span className={`size-4 ${item.color ? `text-${item.color}` : ''}`}>{item.icon}</span>}
                                                        <span>{item.label}</span>
                                                    </span>
                                                </SelectItemComponent>
                                            ))}
                                        </RadixSelect.Group>
                                        {groupIndex < groups.length - 1 && <RadixSelect.Separator className="m-1 h-px bg-border dark:bg-border-dark" />}
                                    </React.Fragment>
                                ))}
                            </RadixSelect.Viewport>
                            <RadixSelect.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-white dark:bg-accent-dark text-primary dark:text-primary-dark">
                                <ChevronDown className="size-4" />
                            </RadixSelect.ScrollDownButton>
                        </RadixSelect.Content>
                    </RadixSelect.Portal>
                </RadixSelect.Root>
            </div>
        )
    }
)
Select.displayName = 'Select'
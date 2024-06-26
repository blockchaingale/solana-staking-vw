export interface CustomLabelProps {
    icon: StaticImageData;
    amount?: number;
    balance?: string;
    onChange?: (value: number) => void;
    onMax?: () => void;
}
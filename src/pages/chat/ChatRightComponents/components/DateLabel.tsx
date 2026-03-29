interface DateLabelProps {
  label: string;
}

export default function DateLabel({ label }: DateLabelProps) {
  return (
    <div className="text-center">
      <span className="glass-effect px-2 text-[14px] py-1 rounded-full text-foreground">
        {label}
      </span>
    </div>
  );
}

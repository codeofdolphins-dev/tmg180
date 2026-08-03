import Card from './Card';
import IconTile from './IconTile';
import Button from './Button';

export default function EmptyStateCard({
  icon,
  heading,
  subtitle,
  buttonLabel,
  buttonIcon,
  buttonVariant = 'primary',
}) {
  return (
    <Card className="max-w-sm bg-white/70">
      <IconTile icon={icon} size="sm" />
      <h1 className="text-lg font-bold text-slate-900 mb-3">{heading}</h1>
      <p className="text-slate-500 text-sm mb-6 leading-relaxed">{subtitle}</p>
      <Button variant={buttonVariant} icon={buttonIcon}>
        {buttonLabel}
      </Button>
    </Card>
  );
}

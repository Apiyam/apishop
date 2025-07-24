import { Card, CardContent, Typography, AspectRatio, Link, Chip } from '@mui/joy'
import { CategoryItem } from '../lib/wooApi'

type CategoryButtonProps = {
  category: CategoryItem
  onClick?: () => void
}

export default function CategoryButton({ category, onClick }: CategoryButtonProps) {
  const { name, image } = category
  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      sx={{
        width: 320,
        '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
      }}
    >
      <AspectRatio ratio="1" sx={{ width: 90 }}>
        <img
          src={image}
          loading="lazy"
          alt=""
        />
      </AspectRatio>
      <CardContent>
        <Typography level="title-lg" id="card-description">
          {name}
        </Typography>
        <Typography
          level="body-sm"
          aria-describedby="card-description"
          sx={{ mb: 1 }}
        >
          <Link
            overlay
            underline="none"
            href="#interactive-card"
            sx={{ color: 'text.tertiary' }}
          >
                {name}
          </Link>
        </Typography>
        <Chip
          variant="outlined"
          color="primary"
          size="sm"
          sx={{ pointerEvents: 'none' }}
        >
          Cool weather all day long
        </Chip>
      </CardContent>
    </Card>
  )
}
import { Box, IconButton, Input, Button } from "@mui/joy"
import { useCallback, useEffect, useState } from "react"
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { useCart } from "../context/CartContext"
import { ProductItem } from "../lib/wooApi"
import Notification from "./Notification"

type QuantitySelectorProps = {
    product: ProductItem
    simple?: boolean   
  }
  
 export default function QuantitySelector({ product, simple }: QuantitySelectorProps) {
    const { addToCart, searchItem, setShouldDisplayCart } = useCart()
    const item = searchItem(product.id)
    const [quantity, setQuantity] = useState(item?.quantity || 1)
    const [addedToCart, setAddedToCart] = useState(false)
    const { updatedCart } = useCart()
    useEffect(() => {
        if (updatedCart) {
            setAddedToCart(true)
        }
    }, [updatedCart])
    const delayedAddToCart = (qty: number) => {
        addToCart({
            product: product,
            quantity: qty, 
          })
    }

    const handleIncrease = () => {
      if (quantity < product.stock) {
        setQuantity((prev) => prev + 1)
        if(simple){
            delayedAddToCart(quantity+1)
        }
      }
      
    }
  
    const handleDecrease = () => {
      if (quantity > 1) {
        setQuantity((prev) => prev - 1)
        if(simple){
            delayedAddToCart(quantity-1)
        }
      }
    }
  
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center',  }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            justifyContent: 'center',
            mb: 2,
            borderRadius: 'md',
            bgcolor: 'neutral.softBg',
            p: 0.5,
          }}
        >
          <IconButton
            size="sm"
            variant="soft"
            color="neutral"
            onClick={handleDecrease}
            disabled={quantity === 1}
          >
            <RemoveRoundedIcon />
          </IconButton>
  
          <Input
            value={quantity}
            readOnly
            variant="soft"
            sx={{
              width: 50,
              textAlign: 'center',
              fontWeight: 'lg',
              fontSize: 'md',
              pointerEvents: 'none',
              '& input': {
                textAlign: 'center',
              },
            }}
          />
  
          <IconButton
            size="sm"
            variant="soft"
            color="neutral"
            onClick={handleIncrease}
            disabled={quantity >= product.stock}
          >
            <AddRoundedIcon />
          </IconButton>
        </Box>
  
        {!simple && (
          <>
          {addedToCart && (
            <Notification message="El carrito ha sido actualizado" open={addedToCart} onClose={() => setAddedToCart(false)} />
          )}
          <Button
            color="primary"
          fullWidth
          disabled={product.stock === 0 || product.stock === null}
          sx={{ padding: 1.5, marginTop:"-20px" }}
          onClick={() => {
            addToCart({
              product: product,
              quantity: quantity,
            })
            setShouldDisplayCart(true)
          }}
        >
            Agregar {quantity} al carrito
          </Button>
          </>
            
        )}
      </Box>
    )
  }
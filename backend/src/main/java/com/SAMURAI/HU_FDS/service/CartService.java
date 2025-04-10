package com.SAMURAI.HU_FDS.service;

import com.SAMURAI.HU_FDS.model.Cart;
import com.SAMURAI.HU_FDS.model.CartItem;
import com.SAMURAI.HU_FDS.model.MenuItem;
import com.SAMURAI.HU_FDS.model.User;
import com.SAMURAI.HU_FDS.repo.CartItemRepository;
import com.SAMURAI.HU_FDS.repo.CartRepository;
import com.SAMURAI.HU_FDS.repo.MenuItemRepository;
import com.SAMURAI.HU_FDS.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    public Cart getCart(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    public Cart addItemToCart(String username, Long menuItemId, int quantity) {
        Cart cart = getCart(username);
        MenuItem item = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        for (CartItem cartItem : cart.getItems()) {
            if ((cartItem.getMenuItem().getId()) == menuItemId){
                cartItem.setQuantity(cartItem.getQuantity() + quantity);
                return cartRepository.save(cart);
            }
        }

        CartItem newItem = new CartItem();
        newItem.setMenuItem(item);
        newItem.setQuantity(quantity);
        newItem.setCart(cart);
        cart.getItems().add(newItem);

        return cartRepository.save(cart);
    }

    public Cart updateItemQuantity(String username, Long itemId, int quantity) {
        Cart cart = getCart(username);
        for (CartItem item : cart.getItems()) {
            if (item.getId().equals(itemId)) {
                item.setQuantity(quantity);
                break;
            }
        }
        return cartRepository.save(cart);
    }

    public Cart removeItem(String username, Long itemId) {
        Cart cart = getCart(username);
        cart.getItems().removeIf(item -> item.getId().equals(itemId));
        return cartRepository.save(cart);
    }

    public void clearCart(String username) {
        Cart cart = getCart(username);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}


# chrono-app - Fixes à appliquer

## Problème 1: Bips disparaissent sur iOS

### Cause
- `useTimer()` est appelé **3 fois** (page.tsx + TimerDisplay.tsx + PresetGrid.tsx)
- Chaque composant a sa propre instance AudioContext
- L'`initAudio()` appelé dans TimerDisplay n'est pas celui utilisé par `playBeep()` dans le useTimer du store

### Solutions à appliquer

1. **Supprimer les appels multiples de `useTimer()`**
   - Retirer `useTimer()` de `page.tsx` (laisser seulement dans les composants qui l'utilisent)
   - OU mieux: garder `useTimer()` uniquement dans `page.tsx` et passer `initAudio` par props

2. **Améliorer la compatibilité iOS pour l'audio**
   - Ajouter un "dummy beep" silence au premier clic pour amorcer l'AudioContext
   - Utiliser un flag pour s'assurer que l'audio est bien initialisé avant toute lecture

## Problème 2: Écran se met en veille sur iOS

### Cause
- L'API WakeLock n'est **pas supportée sur iOS Safari**
- `navigator.wakeLock` n'existe pas sur iOS

### Solutions à appliquer

1. **Détecter le support WakeLock correctement**
   ```typescript
   const isWakeLockSupported = typeof navigator !== 'undefined' && 'wakeLock' in navigator && !isIOS();
   ```

2. **Alternative iOS** (workaround)
   - Utiliser le hack `playsInline` avec une vidéo muette 1x1 pixel
   - OU utiliser la librairie `no-sleep.js` qui implémente ce hack
   - OU simplement afficher une notification à l'utilisateur iOS

3. **Fallback avec vidéo (no-sleep pattern)**
   ```typescript
   // Créer un élément vidéo muet en loop
   const video = document.createElement('video');
   video.src = '...'; // Un courts silence ou frame noire
   video.muted = true;
   video.playsInline = true;
   video.loop = true;
   video.play();
   ```

4. **Solution simple: Ajouter une note pour iOS**
   - Informer l'utilisateur iOS que l'écran peut s'éteindre
   - Proposer de jouer un son continu en arrière-plan (pire solution, battery drain)

---

## Fichiers à modifier

1. `/src/hooks/useTimer.ts` - Améliorer initAudio() et ajouter fallback WakeLock
2. `/src/app/page.tsx` - Retirer double useTimer()
3. `/src/components/TimerDisplay.tsx` - Utiliser initAudio depuis props ou store
4. `/src/components/PresetGrid.tsx` - Utiliser initAudio depuis props ou store

## Priorité

1. **Haute**: Corriger le double usage de useTimer() - c'est le bug principal des bips
2. **Moyenne**: Ajouter détection iOS pour WakeLock et fallback vidéo
3. **Basse**: Feedback utilisateur iOS pour le wake lock

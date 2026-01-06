# Testing Email Collection to Firestore

## Prerequisites

1. **Firestore Database must be created** in Firebase Console:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select project: `vibenbuild-47854`
   - Navigate to **Firestore Database**
   - Click **Create database** if not already created
   - Start in **Test mode** (we'll deploy proper rules)
   - Choose a location

2. **Deploy Firestore Rules** (optional but recommended):
   ```bash
   npm run deploy:firestore
   ```

## Testing Steps

### Method 1: Manual Testing via UI

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open the app** in your browser:
   - Navigate to `http://localhost:3000`

3. **Test the email submission**:
   - Wait for the typing animation to complete
   - Click the **"Get notified"** button
   - Enter a test email (e.g., `test@example.com`)
   - Click **Subscribe**
   - You should see a success message

4. **Verify in Firebase Console**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select project: `vibenbuild-47854`
   - Navigate to **Firestore Database**
   - You should see a `subscribers` collection
   - Click on it to see the submitted email

### Method 2: Check Browser Console

1. Open browser Developer Tools (F12 or Cmd+Option+I)
2. Go to the **Console** tab
3. Submit an email
4. Check for any errors in the console
5. Successful submission should log no errors

### Method 3: Check Network Tab

1. Open browser Developer Tools
2. Go to the **Network** tab
3. Submit an email
4. Look for Firestore API calls (should see `firestore.googleapis.com` requests)
5. Check if requests return 200 OK status

## Expected Behavior

✅ **Success Flow**:
- Modal opens when clicking "Get notified"
- Email validation works (valid email format)
- Duplicate emails are detected and shown as error
- Success message appears after submission
- Modal auto-closes after 2 seconds

❌ **Error Cases**:
- Invalid email format → Shows error message
- Duplicate email → Shows "This email is already subscribed"
- Network/Firebase error → Shows "Failed to subscribe. Please try again."

## Troubleshooting

### "Firebase configuration is missing" warning
- Check that `.env.local` file exists in the project root
- Verify all environment variables are set
- Restart the dev server after adding `.env.local`

### "Permission denied" error
- Make sure Firestore database is created
- If using security rules, deploy them: `npm run deploy:firestore`
- Check Firestore rules allow writes to `subscribers` collection

### Data not appearing in Firestore
- Wait a few seconds (Firestore updates can take a moment)
- Refresh the Firebase Console
- Check browser console for errors
- Verify Firestore database location matches your region

## Viewing Subscribers

After testing, view all subscribers:
1. Go to Firebase Console
2. Firestore Database
3. Click on `subscribers` collection
4. Each document shows:
   - `email`: The submitted email address
   - `subscribedAt`: Timestamp of when they subscribed


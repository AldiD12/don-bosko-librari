# 🚀 Don Bosko Library - Production Deployment Guide

## Step-by-Step Production Setup

### 1. 📋 Prerequisites

- GitHub account
- Vercel or Netlify account (free)
- Your library project ready

### 2. 🔑 Create GitHub Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Give it a name: "Don Bosko Library Admin"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click "Generate token"
6. **IMPORTANT**: Copy the token immediately (you won't see it again)

### 3. 🌐 Deploy to Vercel (Recommended)

#### Option A: Automatic Deployment
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your `don-bosko-librari` repository
5. Configure build settings:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

#### Option B: Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# In your project directory
vercel

# Follow the prompts
```

### 4. 🔧 Environment Variables Setup

In Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add these variables:

```
REACT_APP_GITHUB_TOKEN=your_github_token_here
REACT_APP_GITHUB_OWNER=AldiD12
REACT_APP_GITHUB_REPO=don-bosko-librari
REACT_APP_ADMIN_PASSWORD=your_secure_admin_password
REACT_APP_LIBRARIAN_PASSWORD=your_secure_librarian_password
REACT_APP_TEACHER_PASSWORD=your_secure_teacher_password
```

### 5. 🔄 Enable Auto-Deployment

1. In Vercel, go to Settings → Git
2. Enable "Auto-deploy" for main branch
3. Now every GitHub commit will auto-deploy!

### 6. 🎯 Custom Domain (Optional)

1. In Vercel → Settings → Domains
2. Add your custom domain: `donbosko-library.com`
3. Follow DNS setup instructions

### 7. ✅ Test Your Production Site

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Test the main library
3. Go to `/admin` and test admin panel
4. Add a book and verify it updates the GitHub file
5. Check that changes appear on the live site

## 🔒 Security Recommendations

### Production Passwords
Change default passwords to strong ones:
```
Admin: Use a strong 16+ character password
Librarian: Different strong password
Teacher: Another different strong password
```

### GitHub Token Security
- Never commit the token to your repository
- Use environment variables only
- Regenerate token if compromised

## 🚨 Troubleshooting

### Common Issues:

**1. Admin panel not saving changes**
- Check GitHub token is correct
- Verify repository name and owner
- Check browser console for errors

**2. Changes not appearing on live site**
- Wait 1-2 minutes for deployment
- Check Vercel deployment logs
- Verify auto-deployment is enabled

**3. Admin login not working**
- Check environment variables are set
- Clear browser cache
- Verify passwords are correct

## 📊 Monitoring Your Site

### Vercel Analytics
- Enable in Vercel dashboard
- Track visitors and performance
- Monitor deployment status

### GitHub Integration
- All changes are version controlled
- See commit history for data changes
- Rollback if needed

## 🎉 You're Live!

Your Don Bosko Library is now:
- ✅ Live on the internet
- ✅ Automatically deploying changes
- ✅ Secure admin access
- ✅ Real-time content management
- ✅ Professional and reliable

**Admin URL**: `https://your-site.vercel.app/admin`
**Public URL**: `https://your-site.vercel.app`

## 📞 Support

If you need help:
1. Check the troubleshooting section above
2. Look at Vercel deployment logs
3. Check GitHub commit history
4. Test in development mode first

---

**Congratulations! Your school library is now a professional, live website! 🎓📚**
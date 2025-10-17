# CollabCanvas Bug Tracking

This directory tracks bugs, issues, and their solutions for easy reference and knowledge sharing.

## Bug Report Template

When documenting a bug, create a new file named `bug-YYYY-MM-DD-short-description.md` with the following structure:

```markdown
# Bug: [Short Description]

**Date Reported**: YYYY-MM-DD  
**Reported By**: [Name]  
**Severity**: Critical | High | Medium | Low  
**Status**: Open | In Progress | Resolved | Cannot Reproduce  
**Component**: [Canvas | AI | Authentication | Sync | UI | etc.]

---

## Description

Clear description of the bug and its impact.

## Steps to Reproduce

1. Step one
2. Step two
3. Step three

## Expected Behavior

What should happen.

## Actual Behavior

What actually happens.

## Environment

- **Browser**: Chrome 120 / Firefox 115 / Safari 17
- **OS**: macOS / Windows / Linux
- **Deployment**: Local / Production
- **User Count**: Single / Multiple users

## Screenshots/Videos

[If applicable, add screenshots or video links]

## Error Messages

```
Paste any error messages from console
```

## Investigation Notes

- Finding 1
- Finding 2
- Root cause analysis

## Solution

### Fix Applied

Description of the fix and why it works.

### Code Changes

```typescript
// Before
old code

// After
new code
```

### Files Modified

- `path/to/file1.ts`
- `path/to/file2.tsx`

### Testing

How the fix was tested and verified.

## Prevention

How to prevent this issue in the future (if applicable).

- Code review checklist item
- Test coverage improvement
- Documentation update

## Related Issues

- Related bug #1
- Related feature request #2

---

**Resolution Date**: YYYY-MM-DD  
**Resolved By**: [Name]
```

---

## Quick Reference: Common Issues

### Performance Issues

**Symptom**: FPS drops, lag during interactions  
**Common Causes**:
- Too many shapes rendering
- Missing React.memo optimization
- Cursor update throttling issues
- Firestore listener overhead

**Quick Fixes**:
- Check FPS counter in Debug Panel
- Review React Profiler in DevTools
- Verify Konva layer configuration
- Check Firestore query efficiency

---

### Sync Issues

**Symptom**: Shapes not appearing for all users  
**Common Causes**:
- Firebase rules blocking writes
- Network connectivity problems
- onSnapshot listener not attached
- Lock conflicts

**Quick Fixes**:
- Check Firebase Console for rule violations
- Verify network in DevTools
- Check console for Firestore errors
- Test with lock timeout adjustments

---

### Authentication Issues

**Symptom**: Login fails, session lost  
**Common Causes**:
- Firebase config missing
- Auth state not persisted
- Token expiration
- CORS issues

**Quick Fixes**:
- Verify `.env.local` has all Firebase keys
- Check Firebase Auth console for user status
- Test with incognito/private window
- Review browser console for CORS errors

---

### AI Command Issues

**Symptom**: Commands fail or produce wrong results  
**Common Causes**:
- Missing/invalid OpenAI API key
- Rate limiting
- Command parsing ambiguity
- Shape identifier not found

**Quick Fixes**:
- Verify `VITE_OPENAI_API_KEY` in `.env.local`
- Check OpenAI API usage dashboard
- Review AI service console logs
- Test with explicit shape identifiers

---

### Canvas Rendering Issues

**Symptom**: Shapes not visible, misaligned, or distorted  
**Common Causes**:
- Stage transform not applied correctly
- Shape coordinates outside viewport
- Z-index conflicts
- Konva caching issues

**Quick Fixes**:
- Check stage position and scale in console
- Verify shape x/y coordinates
- Review shape zIndex values
- Force Konva layer redraw

---

## Bug Severity Guide

### Critical
- System unusable
- Data loss
- Security vulnerability
- Affects all users

**Response Time**: Immediate  
**Example**: Firebase rules allowing unauthorized access

### High
- Major feature broken
- Significant UX degradation
- Affects majority of users

**Response Time**: Same day  
**Example**: Real-time sync not working

### Medium
- Feature partially broken
- Workaround available
- Affects some users

**Response Time**: Within week  
**Example**: AI command occasionally fails

### Low
- Minor visual issue
- Edge case
- Affects few users

**Response Time**: Next sprint  
**Example**: Toast notification text cut off

---

## Bug Workflow

```
[Reported] → [Triaged] → [In Progress] → [Fixed] → [Testing] → [Resolved] → [Closed]
```

1. **Reported**: Bug documented using template
2. **Triaged**: Severity assigned, component identified
3. **In Progress**: Developer working on fix
4. **Fixed**: Code changes committed
5. **Testing**: Fix verified in staging
6. **Resolved**: Deployed to production
7. **Closed**: Confirmed working, documentation updated

---

## Example Bugs

See example bug reports in this directory:

- `bug-2025-10-15-drag-delete-race-condition.md` - Race condition fix
- `bug-2025-10-12-fps-drop-100-shapes.md` - Performance optimization
- `bug-2025-10-10-cursor-ghost-presence.md` - onDisconnect cleanup

---

## Contributing

When fixing a bug:

1. Create/update bug document with investigation notes
2. Document solution and code changes
3. Add testing verification
4. Update prevention measures
5. Close bug after production verification

---

## Analytics

Track bug metrics:

- **MTTR** (Mean Time To Resolution): Average time from report to fix
- **Bug Rate**: Bugs per feature/week
- **Recurrence**: Same bug reported multiple times
- **Component Analysis**: Which components have most bugs

---

**Last Updated**: October 16, 2025  
**Total Bugs Tracked**: 0 (newly created)  
**Open Bugs**: 0  
**Resolved This Month**: 0

